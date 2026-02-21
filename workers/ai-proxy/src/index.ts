type Env = {
  AI_BACKEND_URL?: string;
  BACKEND_AUTH_TOKEN?: string;
  ALLOWED_ORIGIN?: string;
};

type ChatRequest = {
  prompt?: unknown;
};

type BackendResponse = {
  text?: string;
  error?: string;
};

function compactSnippet(value: string, maxLength = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength)}...`;
}

function json(
  body: Record<string, unknown>,
  init?: { status?: number; headers?: HeadersInit },
) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "");
}

function parseAllowedOrigins(allowedOrigin?: string) {
  if (!allowedOrigin || allowedOrigin.trim() === "*") {
    return "*";
  }

  const origins = allowedOrigin
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  if (origins.length === 0 || origins.includes("*")) {
    return "*";
  }

  return origins;
}

function isAllowedOrigin(origin: string | null, allowedOrigin?: string) {
  const allowedOrigins = parseAllowedOrigins(allowedOrigin);
  if (allowedOrigins === "*") {
    return true;
  }
  if (!origin) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  return allowedOrigins.includes(normalizedOrigin);
}

function buildCorsHeaders(origin: string | null, allowedOrigin?: string) {
  const allowedOrigins = parseAllowedOrigins(allowedOrigin);
  const resolvedOrigin =
    allowedOrigins === "*"
      ? origin ?? "*"
      : origin && allowedOrigins.includes(normalizeOrigin(origin))
        ? origin
        : "null";

  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function handleChatRequest(request: Request, env: Env) {
  const origin = request.headers.get("Origin");
  const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGIN);

  if (!isAllowedOrigin(origin, env.ALLOWED_ORIGIN)) {
    return json(
      { error: "허용되지 않은 Origin입니다." },
      { status: 403, headers: corsHeaders },
    );
  }

  if (!env.AI_BACKEND_URL) {
    return json(
      {
        error:
          "AI_BACKEND_URL이 설정되지 않았습니다. Cloud Run 백엔드 주소를 설정해 주세요.",
      },
      { status: 500, headers: corsHeaders },
    );
  }

  let payload: ChatRequest;
  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return json(
      { error: "JSON 본문 형식이 올바르지 않습니다." },
      { status: 400, headers: corsHeaders },
    );
  }

  const prompt = payload.prompt;
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return json(
      { error: "prompt는 비어 있지 않은 문자열이어야 합니다." },
      { status: 400, headers: corsHeaders },
    );
  }

  if (prompt.length > 20000) {
    return json(
      { error: "prompt 길이가 너무 깁니다." },
      { status: 413, headers: corsHeaders },
    );
  }

  const backendEndpoint = `${env.AI_BACKEND_URL.replace(/\/$/, "")}/chat`;
  const backendHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (env.BACKEND_AUTH_TOKEN) {
    backendHeaders.Authorization = `Bearer ${env.BACKEND_AUTH_TOKEN}`;
  }

  try {
    const backendResponse = await fetch(backendEndpoint, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify({ prompt }),
    });

    const rawBody = await backendResponse.text();
    let backendData: BackendResponse | null = null;
    if (rawBody) {
      try {
        backendData = JSON.parse(rawBody) as BackendResponse;
      } catch {
        console.error("AI backend returned non-JSON response", {
          endpoint: backendEndpoint,
          status: backendResponse.status,
          contentType: backendResponse.headers.get("content-type") ?? "",
          bodySnippet: compactSnippet(rawBody),
        });
      }
    }

    if (!backendData) {
      const fallbackError =
        compactSnippet(rawBody) ||
        "AI 백엔드 응답 형식이 올바르지 않습니다. Cloud Run 배포/URL/토큰을 확인해 주세요.";
      return json(
        { error: fallbackError },
        { status: backendResponse.status || 502, headers: corsHeaders },
      );
    }

    if (!backendResponse.ok) {
      return json(
        { error: backendData.error ?? "AI 백엔드 요청에 실패했습니다." },
        { status: backendResponse.status, headers: corsHeaders },
      );
    }

    const answer = (backendData.text ?? "").trim();
    return json(
      { text: answer || "사이트 내 정보로는 확인되지 않습니다." },
      { headers: corsHeaders },
    );
  } catch {
    return json(
      { error: "AI 백엔드 연결에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502, headers: corsHeaders },
    );
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/healthz") {
      return json({ ok: true }, { headers: corsHeaders });
    }

    if (url.pathname !== "/chat") {
      return json(
        { error: "Not Found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (request.method !== "POST") {
      return json(
        { error: "Method Not Allowed" },
        { status: 405, headers: corsHeaders },
      );
    }

    return handleChatRequest(request, env);
  },
};
