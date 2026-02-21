const { createServer } = require("node:http");

const PORT = Number(process.env.PORT || 8080);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const configuredMaxOutputTokens = Number.parseInt(
  process.env.GEMINI_MAX_OUTPUT_TOKENS || "",
  10,
);
const GEMINI_MAX_OUTPUT_TOKENS =
  Number.isFinite(configuredMaxOutputTokens) && configuredMaxOutputTokens > 0
    ? Math.max(configuredMaxOutputTokens, 2048)
    : 4096;
const BACKEND_AUTH_TOKEN = process.env.BACKEND_AUTH_TOKEN || "";
const MAX_PROMPT_LENGTH = 20000;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_CONTINUATION_ROUNDS = 3;
const DAILY_REQUEST_LIMIT = Math.max(
  0,
  Number.parseInt(process.env.DAILY_REQUEST_LIMIT || "200", 10) || 200,
);
const DAILY_LIMIT_TIMEZONE = process.env.DAILY_LIMIT_TIMEZONE || "Asia/Seoul";

let usageCounter = {
  dayKey: "",
  count: 0,
};

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function getDayKey(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: DAILY_LIMIT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function consumeDailyQuota() {
  const dayKey = getDayKey();
  if (usageCounter.dayKey !== dayKey) {
    usageCounter = { dayKey, count: 0 };
  }

  if (usageCounter.count >= DAILY_REQUEST_LIMIT) {
    return {
      allowed: false,
      dayKey,
      count: usageCounter.count,
      limit: DAILY_REQUEST_LIMIT,
    };
  }

  usageCounter.count += 1;
  return {
    allowed: true,
    dayKey,
    count: usageCounter.count,
    limit: DAILY_REQUEST_LIMIT,
  };
}

function getRetrySecondsFromMessage(message) {
  const matched = message.match(/retry in\s+([\d.]+)s/i);
  if (!matched) {
    return null;
  }

  const value = Number.parseFloat(matched[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.ceil(value);
}

function toFriendlyGeminiError(status, rawMessage = "") {
  const message = rawMessage.trim();
  const lowered = message.toLowerCase();

  if (
    status === 429 ||
    lowered.includes("quota exceeded") ||
    lowered.includes("rate limit")
  ) {
    const retrySeconds = getRetrySecondsFromMessage(message);
    if (retrySeconds) {
      return `현재 AI 사용량 한도에 도달했습니다. 약 ${retrySeconds}초 뒤 다시 시도해 주세요. 문제가 계속되면 Gemini 프로젝트의 결제/할당량 설정을 확인해 주세요.`;
    }
    return "현재 AI 사용량 한도에 도달했습니다. 잠시 후 다시 시도해 주세요. 문제가 계속되면 Gemini 프로젝트의 결제/할당량 설정을 확인해 주세요.";
  }

  if (
    lowered.includes("no longer available") ||
    lowered.includes("model is not found")
  ) {
    return "현재 설정된 AI 모델이 더 이상 지원되지 않습니다. 최신 모델로 설정을 업데이트해 주세요.";
  }

  if (
    lowered.includes("user location is not supported") ||
    lowered.includes("location is not supported for the api use")
  ) {
    return "현재 위치에서는 Gemini Developer API 사용이 제한됩니다. 지원 지역 네트워크에서 다시 시도하거나, Vertex AI(지원 리전)로 전환해 주세요.";
  }

  if (
    status === 401 ||
    status === 403 ||
    lowered.includes("api key not valid") ||
    lowered.includes("permission denied")
  ) {
    return "AI API 키 또는 권한 설정을 확인해 주세요.";
  }

  if (status >= 500) {
    return "현재 AI 서버 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.";
  }

  return message || "AI 요청에 실패했습니다.";
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let raw = "";

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
        return;
      }
      raw += chunk.toString("utf8");
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("BAD_JSON"));
      }
    });

    req.on("error", reject);
  });
}

function buildGeminiText(geminiData) {
  return (
    geminiData.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || "사이트 내 정보로는 확인되지 않습니다."
  );
}

function getGeminiFinishReason(geminiData) {
  return geminiData?.candidates?.[0]?.finishReason || "";
}

function mergeAnswerText(baseText, nextText) {
  const base = (baseText || "").trim();
  const next = (nextText || "").trim();
  if (!base) {
    return next;
  }
  if (!next) {
    return base;
  }

  const maxOverlap = Math.min(base.length, next.length, 120);
  for (let overlap = maxOverlap; overlap >= 20; overlap -= 1) {
    const baseTail = base.slice(base.length - overlap);
    const nextHead = next.slice(0, overlap);
    if (baseTail === nextHead) {
      return `${base}${next.slice(overlap)}`;
    }
  }

  return `${base}\n\n${next}`;
}

function looksTruncatedText(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return false;
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lastLine = lines[lines.length - 1] || "";
  const danglingListMarker =
    /^[-*•]\s*$/.test(lastLine) || /^\d+[.)]\s*$/.test(lastLine);
  const danglingChecklist = /^[-*]\s+\[[ xX]?\]\s*$/.test(lastLine);
  const endsWithConnector = /[,:;\-–—(]$/.test(lastLine);

  const lastChar = trimmed.slice(-1);
  const endsWithNaturalMark = /[.!?…"”')\]]$/.test(lastChar);
  const oddBoldMarkerCount = (trimmed.match(/\*\*/g) || []).length % 2 === 1;
  const oddBacktickCount = (trimmed.match(/`/g) || []).length % 2 === 1;
  const openParenCount = (trimmed.match(/\(/g) || []).length;
  const closeParenCount = (trimmed.match(/\)/g) || []).length;
  const hasUnclosedParen = openParenCount > closeParenCount;
  const likelyMidSentence = /^[A-Za-z0-9가-힣(].*/.test(lastLine) && !endsWithNaturalMark;

  return (
    danglingListMarker ||
    danglingChecklist ||
    oddBoldMarkerCount ||
    oddBacktickCount ||
    endsWithConnector ||
    (hasUnclosedParen && !endsWithNaturalMark) ||
    likelyMidSentence
  );
}

function stripDanglingEndingArtifacts(text) {
  return (text || "")
    .replace(/\n?(?:[-*•]\s*|\d+[.)]\s*)$/u, "")
    .trim();
}

function clipText(text, maxLength) {
  const normalized = (text || "").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength)}...`;
}

function extractQuestionFromPrompt(originalPrompt) {
  const marker = "\n질문:\n";
  const markerIndex = originalPrompt.lastIndexOf(marker);
  if (markerIndex === -1) {
    return clipText(originalPrompt, 2000);
  }
  return clipText(originalPrompt.slice(markerIndex + marker.length), 2000);
}

function extractContextFromPrompt(originalPrompt) {
  const startMarker = "\nCONTEXT:\n";
  const endMarker = "\n\n이전 대화:\n";
  const startIndex = originalPrompt.indexOf(startMarker);
  if (startIndex === -1) {
    return "";
  }

  const from = startIndex + startMarker.length;
  const endIndex = originalPrompt.indexOf(endMarker, from);
  const rawContext =
    endIndex === -1 ? originalPrompt.slice(from) : originalPrompt.slice(from, endIndex);
  return clipText(rawContext, 6000);
}

function parseRequestedItemCount(text) {
  const numericMatch = text.match(/(\d+)\s*(개|가지|건|항목)/);
  if (numericMatch) {
    const count = Number.parseInt(numericMatch[1], 10);
    if (Number.isFinite(count) && count > 0 && count <= 20) {
      return count;
    }
  }

  const koreanMap = {
    한: 1,
    하나: 1,
    두: 2,
    둘: 2,
    세: 3,
    셋: 3,
    네: 4,
    넷: 4,
    다섯: 5,
    여섯: 6,
    일곱: 7,
    여덟: 8,
    아홉: 9,
    열: 10,
  };
  const koreanMatch = text.match(
    /(한|하나|두|둘|세|셋|네|넷|다섯|여섯|일곱|여덟|아홉|열)\s*(개|가지|건|항목)/,
  );
  if (koreanMatch) {
    return koreanMap[koreanMatch[1]] || null;
  }

  return null;
}

function buildCountInstruction(question) {
  const requestedCount = parseRequestedItemCount(question);
  if (!requestedCount) {
    return "";
  }

  return `질문에서 요청한 개수는 정확히 ${requestedCount}개입니다. 번호 목록 1..${requestedCount}로 누락 없이 작성하세요.`;
}

function buildContinuationPrompt(originalPrompt, partialAnswer) {
  const question = extractQuestionFromPrompt(originalPrompt);
  const context = extractContextFromPrompt(originalPrompt);
  const clippedPartial = clipText(partialAnswer, 7000);
  const countInstruction = buildCountInstruction(question);

  return [
    "아래 답변은 길이 제한으로 중간에 끊겼습니다.",
    "기존 내용을 반복하지 말고, 끊긴 지점부터 자연스럽게 이어서 완결해 주세요. 마지막에는 [출처]를 포함해 주세요.",
    countInstruction,
    "[질문]",
    question,
    context ? "[근거 문서 요약]" : "",
    context || "",
    "[현재까지 답변]",
    clippedPartial,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildRewritePrompt(originalPrompt, partialAnswer) {
  const question = extractQuestionFromPrompt(originalPrompt);
  const context = extractContextFromPrompt(originalPrompt);
  const clippedPartial = clipText(partialAnswer, 7000);
  const countInstruction = buildCountInstruction(question);

  return [
    "아래 답변은 문장 중간에서 끊겼습니다.",
    "핵심 의미를 유지하면서 원 질문 요구사항이 빠지지 않도록 완결된 답변으로 다시 작성해 주세요.",
    "현재까지 답변은 일부 항목만 포함될 수 있으니, 질문 요구(개수/형식)에 맞게 누락된 항목을 보완해 주세요.",
    countInstruction,
    "끝문장은 반드시 자연스럽게 마무리하고, 마지막에는 [출처]를 포함해 주세요.",
    "[질문]",
    question,
    context ? "[근거 문서 요약]" : "",
    context || "",
    "[현재까지 답변]",
    clippedPartial,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function requestGemini(promptText) {
  const geminiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `${GEMINI_MODEL}:generateContent`;

  let geminiResponse;
  try {
    geminiResponse = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
        },
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
      }),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Gemini 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  let geminiData;
  try {
    geminiData = await geminiResponse.json();
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Gemini 응답 형식이 올바르지 않습니다.",
    };
  }

  if (!geminiResponse.ok) {
    const rawMessage = geminiData?.error?.message || "";
    return {
      ok: false,
      status: geminiResponse.status,
      error: toFriendlyGeminiError(geminiResponse.status, rawMessage),
      rawMessage,
    };
  }

  return {
    ok: true,
    text: buildGeminiText(geminiData),
    finishReason: getGeminiFinishReason(geminiData),
  };
}

async function handleChat(req, res) {
  if (BACKEND_AUTH_TOKEN) {
    const authorization = req.headers.authorization || "";
    if (authorization !== `Bearer ${BACKEND_AUTH_TOKEN}`) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }
  }

  if (!GEMINI_API_KEY) {
    sendJson(res, 500, {
      error: "GEMINI_API_KEY가 설정되지 않았습니다.",
    });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
      sendJson(res, 413, { error: "요청 본문이 너무 큽니다." });
      return;
    }
    sendJson(res, 400, { error: "JSON 본문 형식이 올바르지 않습니다." });
    return;
  }

  const prompt = payload?.prompt;
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    sendJson(res, 400, {
      error: "prompt는 비어 있지 않은 문자열이어야 합니다.",
    });
    return;
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    sendJson(res, 413, { error: "prompt 길이가 너무 깁니다." });
    return;
  }

  const quota = consumeDailyQuota();
  if (!quota.allowed) {
    sendJson(res, 429, {
      error: `오늘 AI 요청 한도(${quota.limit}회)를 초과했습니다. 내일 다시 시도해 주세요.`,
    });
    return;
  }

  const firstAnswer = await requestGemini(prompt);
  if (!firstAnswer.ok) {
    console.error("Gemini API error", {
      status: firstAnswer.status,
      model: GEMINI_MODEL,
      message: firstAnswer.rawMessage || firstAnswer.error,
    });
    sendJson(res, firstAnswer.status, { error: firstAnswer.error });
    return;
  }

  let finalAnswer = firstAnswer.text || "사이트 내 정보로는 확인되지 않습니다.";
  let finishReason = firstAnswer.finishReason || "";
  let continuationRound = 0;
  let continuationFailed = false;

  while (continuationRound < MAX_CONTINUATION_ROUNDS) {
    const shouldContinue =
      finishReason === "MAX_TOKENS" || looksTruncatedText(finalAnswer);
    if (!shouldContinue) {
      break;
    }

    const continuationPrompt = buildContinuationPrompt(prompt, finalAnswer);
    const continuation = await requestGemini(continuationPrompt);
    if (!continuation.ok) {
      console.error("Gemini continuation failed", {
        status: continuation.status,
        model: GEMINI_MODEL,
        message: continuation.rawMessage || continuation.error,
      });
      continuationFailed = true;
      break;
    }

    finalAnswer = mergeAnswerText(finalAnswer, continuation.text);
    finishReason = continuation.finishReason || "";
    continuationRound += 1;
  }

  let stillTruncated =
    finishReason === "MAX_TOKENS" || looksTruncatedText(finalAnswer);

  if (stillTruncated) {
    const rewritten = await requestGemini(buildRewritePrompt(prompt, finalAnswer));
    if (rewritten.ok) {
      finalAnswer = rewritten.text || finalAnswer;
      finishReason = rewritten.finishReason || finishReason;
      stillTruncated =
        finishReason === "MAX_TOKENS" || looksTruncatedText(finalAnswer);
    } else {
      console.error("Gemini rewrite failed", {
        status: rewritten.status,
        model: GEMINI_MODEL,
        message: rewritten.rawMessage || rewritten.error,
      });
    }
  }

  if (stillTruncated) {
    finalAnswer +=
      continuationFailed
        ? "\n\n(답변을 이어서 생성하는 중 오류가 발생해 일부가 잘렸습니다. 다시 시도해 주세요.)"
        : "\n\n(답변이 길어 일부가 잘렸습니다. \"이어서 계속해줘\"라고 입력하시면 이어서 답변해 드립니다.)";
  }

  sendJson(res, 200, { text: stripDanglingEndingArtifacts(finalAnswer) });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");

  if (url.pathname === "/healthz") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname !== "/chat") {
    sendJson(res, 404, { error: "Not Found" });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  await handleChat(req, res);
});

server.listen(PORT, () => {
  console.log(`AI backend listening on :${PORT}`);
});
