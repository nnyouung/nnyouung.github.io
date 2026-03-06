"use client";
import {
  FormEvent,
  Fragment,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildGroundedPrompt,
  buildKnowledgeDocuments,
  findRelevantDocuments,
  type KnowledgeDocument,
} from "../data/aiKnowledge";
import Section from "../components/Section";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  sources?: SourceLink[];
};

type ProxyResponse = {
  text?: string;
  error?: string;
};

type SourceLink = {
  title: string;
  url: string;
};

const starterQuestions = [
  "Dife 프로젝트에서 가장 임팩트 큰 트러블슈팅 3개를 요약해줘.",
  "포트폴리오에서 실시간 통신 관련 경험만 정리해줘.",
  "주요 수상/출시 이력을 연도순으로 알려줘.",
];

function getFallbackSourceUrl(kind: KnowledgeDocument["kind"]) {
  switch (kind) {
    case "experience":
      return "/#experience";
    case "skill":
      return "/#skills";
    case "blog":
      return "https://velog.io/@nnyouung/posts";
    default:
      return "/";
  }
}

function normalizeSourceTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/[^\w가-힣\s-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCitedSourceTitles(answer: string) {
  const sourceMatch = answer.match(/\[출처\]([\s\S]*)$/i);
  const normalizeCitation = (value: string) =>
    value
      .trim()
      .replace(/^[-*•]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .replace(/^\[문서\s*\d+\]\s*/i, "")
      .replace(/\.$/, "")
      .trim();

  if (sourceMatch) {
    const raw = sourceMatch[1].trim();
    if (!raw) {
      return [];
    }

    const titles = raw
      .split(/\n|,/)
      .map((item) => normalizeCitation(item))
      .filter(Boolean);

    if (titles.length > 0) {
      return titles;
    }
  }

  const sourceLinePattern =
    /^(?:[-*•]\s*)?(?:\*\*)?(?:\[\s*출처\s*\]|출처|source)(?:\*\*)?\s*[:：]\s*(.+)$/i;
  const inlineTitles = answer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const matched = line.match(sourceLinePattern);
      if (!matched?.[1]) {
        return "";
      }
      return normalizeCitation(matched[1]);
    })
    .filter(Boolean);

  return inlineTitles;
}

function findDocByCitation(
  citationTitle: string,
  docs: KnowledgeDocument[],
): KnowledgeDocument | null {
  const normalizedCitation = normalizeSourceTitle(citationTitle);
  if (!normalizedCitation) {
    return null;
  }

  const exactMatch =
    docs.find(
      (doc) => normalizeSourceTitle(doc.title) === normalizedCitation,
    ) ?? null;
  if (exactMatch) {
    return exactMatch;
  }

  return (
    docs.find((doc) => {
      const normalizedDocTitle = normalizeSourceTitle(doc.title);
      return (
        normalizedDocTitle.includes(normalizedCitation) ||
        normalizedCitation.includes(normalizedDocTitle)
      );
    }) ?? null
  );
}

function getSourceLinksFromAnswer(
  answer: string,
  allDocs: KnowledgeDocument[],
): SourceLink[] | undefined {
  if (isNoEvidenceAnswer(answer)) {
    return undefined;
  }

  const citedTitles = extractCitedSourceTitles(answer);
  if (citedTitles.length === 0) {
    return undefined;
  }

  const links: SourceLink[] = [];
  const seen = new Set<string>();

  for (const citationTitle of citedTitles) {
    const matchedDoc = findDocByCitation(citationTitle, allDocs);
    if (!matchedDoc) {
      continue;
    }

    const url = matchedDoc.url ?? getFallbackSourceUrl(matchedDoc.kind);
    const key = `${matchedDoc.title}::${url}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    links.push({
      title: matchedDoc.title,
      url,
    });
  }

  return links.length > 0 ? links : undefined;
}

async function requestGeminiAnswer(prompt: string) {
  const proxyUrl = process.env.NEXT_PUBLIC_AI_PROXY_URL;
  if (!proxyUrl) {
    throw new Error(
      "NEXT_PUBLIC_AI_PROXY_URL이 설정되지 않았습니다. Worker 프록시 주소를 추가해 주세요.",
    );
  }

  const endpoint = `${proxyUrl.replace(/\/$/, "")}/chat`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = (await response.json()) as ProxyResponse;
  if (!response.ok) {
    throw new Error(data.error ?? "AI 프록시 요청에 실패했습니다.");
  }

  const answer = (data.text ?? "").trim();

  if (answer) {
    return answer;
  }

  return "사이트 내 정보로는 확인되지 않습니다.";
}

function createMessage(
  role: ChatRole,
  text: string,
  sources?: SourceLink[],
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    sources,
  };
}

function isNoEvidenceAnswer(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return /사이트\s*내\s*정보로는[^.\n]*확인되지\s*않습니다/.test(normalized);
}

function isContinuationRequest(text: string) {
  return /(이어서|계속|마저|이어서\s*말|이어서\s*해|이어서\s*얘기)/.test(
    text.trim(),
  );
}

function getLastUserQuestion(messages: ChatMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i].text;
    }
  }

  return null;
}

function getLastAssistantAnswer(messages: ChatMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "assistant") {
      return messages[i].text;
    }
  }

  return null;
}

function stripSourceSection(answer: string) {
  return answer.replace(/\n?\[출처\][\s\S]*$/i, "").trim();
}

function stripInlineSourceLines(answer: string) {
  const filtered = answer
    .split("\n")
    .filter((line) => {
      const normalized = line.trim();
      return !/^(?:[-*•]\s*)?(?:\*\*)?(?:\[\s*출처\s*\]|출처|source)(?:\*\*)?\s*[:：]/i.test(
        normalized,
      );
    })
    .join("\n");

  return filtered.replace(/\n{3,}/g, "\n\n").trim();
}

function truncateForPrompt(text: string, maxLength = 1200) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

function renderInlineBold(text: string, keyPrefix: string): ReactNode[] {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  while (true) {
    const match = boldRegex.exec(text);
    if (!match) {
      break;
    }

    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={`${keyPrefix}-text-${matchIndex}`}>
          {text.slice(lastIndex, match.index)}
        </Fragment>,
      );
    }

    nodes.push(
      <strong
        key={`${keyPrefix}-bold-${matchIndex}`}
        className="font-semibold text-slate-900"
      >
        {match[1]}
      </strong>,
    );

    lastIndex = match.index + match[0].length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Fragment key={`${keyPrefix}-text-tail`}>
        {text.slice(lastIndex)}
      </Fragment>,
    );
  }

  if (nodes.length === 0) {
    return [text];
  }

  return nodes;
}

function renderAssistantText(text: string) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return blocks.map((block, blockIndex) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return null;
    }

    const isOrderedList = lines.every((line) => /^\d+[.)]\s+/.test(line));
    if (isOrderedList) {
      return (
        <ol
          key={`assistant-block-${blockIndex}`}
          className="list-decimal space-y-1 pl-5"
        >
          {lines.map((line, lineIndex) => (
            <li key={`assistant-line-${blockIndex}-${lineIndex}`}>
              {renderInlineBold(
                line.replace(/^\d+[.)]\s+/, ""),
                `assistant-ordered-${blockIndex}-${lineIndex}`,
              )}
            </li>
          ))}
        </ol>
      );
    }

    const isUnorderedList = lines.every((line) => /^[-*]\s+/.test(line));
    if (isUnorderedList) {
      return (
        <ul
          key={`assistant-block-${blockIndex}`}
          className="list-disc space-y-1 pl-5"
        >
          {lines.map((line, lineIndex) => (
            <li key={`assistant-line-${blockIndex}-${lineIndex}`}>
              {renderInlineBold(
                line.replace(/^[-*]\s+/, ""),
                `assistant-unordered-${blockIndex}-${lineIndex}`,
              )}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`assistant-block-${blockIndex}`} className="whitespace-pre-wrap">
        {lines.map((line, lineIndex) => (
          <Fragment key={`assistant-line-${blockIndex}-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {renderInlineBold(
              line,
              `assistant-paragraph-${blockIndex}-${lineIndex}`,
            )}
          </Fragment>
        ))}
      </p>
    );
  });
}

export default function AiChatPanel() {
  const allDocs = useMemo(() => buildKnowledgeDocuments(), []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expandedSourceMessageIds, setExpandedSourceMessageIds] = useState<
    Set<string>
  >(new Set());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const hasAskedQuestion = messages.some((message) => message.role === "user");
  const isHomeMode = !hasAskedQuestion;

  const toggleSources = (messageId: string) => {
    setExpandedSourceMessageIds((current) => {
      const next = new Set(current);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const askQuestion = async (question: string) => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || isLoading) {
      return;
    }

    const continuationRequest = isContinuationRequest(normalizedQuestion);
    const lastUserQuestion = continuationRequest
      ? getLastUserQuestion(messages)
      : null;
    const lastAssistantAnswer = continuationRequest
      ? getLastAssistantAnswer(messages)
      : null;
    const retrievalQuestion = lastUserQuestion ?? normalizedQuestion;
    const continuationBaseAnswer = lastAssistantAnswer
      ? truncateForPrompt(
          stripInlineSourceLines(stripSourceSection(lastAssistantAnswer)),
        )
      : null;
    const promptQuestion =
      continuationRequest && lastUserQuestion
        ? [
            `이전 핵심 질문: ${lastUserQuestion}`,
            `현재 요청: ${normalizedQuestion}`,
            continuationBaseAnswer
              ? `직전 답변(끊긴 지점 참고): ${continuationBaseAnswer}`
              : "",
            "지시: 바로 직전 답변이 중간에 끊긴 것으로 보고, 앞부분 반복 없이 끊긴 부분부터 자연스럽게 이어서 완성해 주세요.",
          ]
            .filter(Boolean)
            .join("\n")
        : normalizedQuestion;

    const userMessage = createMessage("user", normalizedQuestion);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const relevantDocs = findRelevantDocuments(retrievalQuestion, allDocs, 6);

      const conversationHistory = [...messages, userMessage]
        .slice(-8)
        .map((message) => ({
          role: message.role,
          text: message.text,
        }));
      const prompt = buildGroundedPrompt(
        promptQuestion,
        relevantDocs,
        conversationHistory,
      );
      const answer = await requestGeminiAnswer(prompt);
      const sourceLinks = getSourceLinksFromAnswer(answer, allDocs);
      const cleanedAnswer =
        stripInlineSourceLines(stripSourceSection(answer)) || answer;
      const assistantMessage = createMessage(
        "assistant",
        cleanedAnswer,
        sourceLinks,
      );
      setMessages((current) => [...current, assistantMessage]);
      setExpandedSourceMessageIds((current) => {
        if (
          !assistantMessage.sources ||
          assistantMessage.sources.length === 0
        ) {
          return current;
        }
        const next = new Set(current);
        next.add(assistantMessage.id);
        return next;
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "요청 중 오류가 발생했습니다.";
      setError(message);
      setMessages((current) => [
        ...current,
        createMessage("assistant", message),
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        if (scrollBoxRef.current) {
          scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
        }
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await askQuestion(input);
  };

  const renderInputForm = (isCentered: boolean) => (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          id="ai-chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="예: Sign order에서 gRPC 관련 이슈 해결 과정을 요약해줘."
          autoComplete="off"
          className="h-10 w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-m text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          aria-label="메시지 보내기"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M4 12L20 4L13 20L10.5 13.5L4 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p
        className={`text-xs text-slate-500 ${isCentered ? "text-center" : ""}`}
      >
        AI가 포트폴리오 사이트와 벨로그 콘텐츠를 기반으로 답변합니다 — 사이트
        정보 밖 질문은 답변을 제한합니다. 답변이 부정확할 수 있습니다.
      </p>
    </form>
  );

  return (
      <div className="pt-4 flex h-full min-h-0 flex-col">
        {isHomeMode ? (
          <Section className="pb-12 pt-12" viewportOnce>
            <div className="flex flex-1 flex-col justify-start overflow-y-auto">
              <div className="mx-auto w-full max-w-2xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  AI Assistant
                </p>
                <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  AI 챗봇
                </h1>
                <p className="mt-4 text-base text-slate-500 sm:text-lg">
                  포트폴리오 사이트와 블로그 글을 학습한 AI가 답변합니다.
                </p>

                <div className="space-y-2">
                  <p className="mt-16 text-center text-xs font-semibold text-slate-500">
                    추천 질문
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {starterQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => {
                          void askQuestion(question);
                        }}
                        disabled={isLoading}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-20">{renderInputForm(true)}</div>
              </div>
            </div>
          </Section>
        ) : (
          <>
            <div
              ref={scrollBoxRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`w-fit max-w-[88%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] ${
                    message.role === "assistant"
                      ? "border border-slate-200 bg-white text-slate-700 leading-7"
                      : "ml-auto bg-slate-900 text-white leading-relaxed"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="space-y-3">
                      {renderAssistantText(message.text)}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  )}

                  {message.role === "assistant" &&
                    message.sources &&
                    message.sources.length > 0 && (
                      <div className="mt-3 border-t border-slate-200 pt-3">
                        <button
                          type="button"
                          onClick={() => toggleSources(message.id)}
                          className="text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-800"
                        >
                          {expandedSourceMessageIds.has(message.id)
                            ? "참고 문서 닫기"
                            : `참고 문서 보기 (${message.sources.length})`}
                        </button>

                        {expandedSourceMessageIds.has(message.id) && (
                          <ul className="mt-2 space-y-1 text-xs text-slate-600 sm:text-sm">
                            {message.sources.map((source) => (
                              <li
                                key={`${source.title}-${source.url}`}
                                className="break-all"
                              >
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-700 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-800"
                                >
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="w-fit max-w-[88%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  <div className="inline-flex items-end gap-1.5">
                    <span>답변 생성 중</span>
                    <span className="ai-loading-dot">.</span>
                    <span
                      className="ai-loading-dot"
                      style={{ animationDelay: "0.15s" }}
                    >
                      .
                    </span>
                    <span
                      className="ai-loading-dot"
                      style={{ animationDelay: "0.3s" }}
                    >
                      .
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 shrink-0">{renderInputForm(false)}</div>
          </>
        )}
      </div>
  );
}
