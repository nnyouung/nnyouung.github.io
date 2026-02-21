import { awards, certifications, education } from "./experience";
import { projects } from "./projects";
import { skillGroups } from "./skills";

export type KnowledgeKind =
  | "project"
  | "troubleshooting"
  | "experience"
  | "skill"
  | "blog";

export type KnowledgeDocument = {
  id: string;
  kind: KnowledgeKind;
  title: string;
  content: string;
  url?: string;
  tags: string[];
};

type ConversationTurn = {
  role: "assistant" | "user";
  text: string;
};

const DOCUMENT_FALLBACK_LIMIT = 6;

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^0-9a-z가-힣]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function joinLines(items: string[]) {
  return items.filter(Boolean).join("\n");
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

function includesAny(normalizedText: string, keywords: string[]) {
  return keywords.some(
    (keyword) =>
      normalizedText.includes(keyword) || keyword.includes(normalizedText),
  );
}

function getAchievementIntentTags(type: "award" | "release" | "presentation") {
  switch (type) {
    case "release":
      return ["출시", "배포", "런칭", "릴리스", "release", "launch"];
    case "award":
      return ["수상", "award", "입상", "우승", "본선"];
    default:
      return ["발표", "시연", "데모", "presentation"];
  }
}

function getAchievementTypeLabel(type: "award" | "release" | "presentation") {
  switch (type) {
    case "release":
      return "출시";
    case "award":
      return "수상";
    default:
      return "발표";
  }
}

export function buildKnowledgeDocuments(): KnowledgeDocument[] {
  const profileDoc: KnowledgeDocument = {
    id: "profile-owner",
    kind: "experience",
    title: "포트폴리오 주인 프로필",
    tags: ["하은영", "이름", "포트폴리오 주인", "작성자", "본인", "너", "당신"],
    content:
      "포트폴리오 주인(작성자)의 이름은 하은영입니다. 희망 직무는 Software Engineer입니다.",
  };

  const projectDocs: KnowledgeDocument[] = projects.map((project) => {
    const roleLines = project.roleAndContribution.map((item) => item.text);
    const achievementLines =
      project.achievements?.map((achievement) => {
        const source = achievement.url
          ? ` (${achievement.urlLabel ?? "링크"}: ${achievement.url})`
          : "";
        return `${achievement.date} ${achievement.title}${source}`;
      }) ?? [];

    return {
      id: `project-${project.id}`,
      kind: "project",
      title: project.title,
      url: `/portfolio/${project.id}`,
      tags: project.tech,
      content: joinLines([
        `개요: ${project.overview}`,
        `설명: ${project.description}`,
        `기간: ${project.period}`,
        `기술: ${project.tech.join(", ")}`,
        roleLines.length > 0 ? `역할: ${roleLines.join(" / ")}` : "",
        achievementLines.length > 0
          ? `주요 성과: ${achievementLines.join(" / ")}`
          : "",
      ]),
    };
  });

  const troubleshootingDocs: KnowledgeDocument[] = projects.flatMap((project) =>
    project.troubleshooting.map((item) => ({
      id: `troubleshooting-${project.id}-${item.id}`,
      kind: "troubleshooting" as const,
      title: `${project.title} - ${item.title}`,
      url: `/portfolio/${project.id}`,
      tags: [...item.tags, project.title, "트러블슈팅"],
      content: joinLines([
        `요약: ${item.summary}`,
        `핵심 내용: ${truncate(item.content.replace(/\s+/g, " ").trim(), 520)}`,
        item.lesson ? `배운 점: ${item.lesson}` : "",
      ]),
    })),
  );

  const achievementDocs: KnowledgeDocument[] = projects.flatMap((project) =>
    (project.achievements ?? []).map((achievement, index) => {
      const typeLabel = getAchievementTypeLabel(achievement.type);
      const typeTags = getAchievementIntentTags(achievement.type);
      return {
        id: `achievement-${project.id}-${achievement.id || index}`,
        kind: "experience" as const,
        title: `${project.title} - ${achievement.title}`,
        url: `/portfolio/${project.id}`,
        tags: [project.title, "프로젝트 성과", typeLabel, ...typeTags],
        content: joinLines([
          `구분: ${typeLabel}`,
          `일자: ${achievement.date}`,
          `제목: ${achievement.title}`,
          `프로젝트: ${project.title}`,
          `프로젝트 기간: ${project.period}`,
          achievement.url
            ? `관련 링크: ${achievement.url}`
            : "",
        ]),
      };
    }),
  );

  const experienceDocs: KnowledgeDocument[] = [
    ...education.map((item, index) => ({
      id: `education-${index}`,
      kind: "experience" as const,
      title: `교육 - ${item.title}`,
      tags: ["교육"],
      content: joinLines([`기간: ${item.date}`, item.description ?? ""]),
    })),
    ...awards.map((item, index) => ({
      id: `award-${index}`,
      kind: "experience" as const,
      title: `수상 - ${item.title}`,
      tags: ["수상"],
      content: joinLines([`일자: ${item.date}`, item.description ?? ""]),
    })),
    ...certifications.map((item, index) => ({
      id: `certification-${index}`,
      kind: "experience" as const,
      title: `자격증 - ${item.title}`,
      tags: ["자격증"],
      content: joinLines([`일자: ${item.date}`, item.description ?? ""]),
    })),
  ];

  const skillDocs: KnowledgeDocument[] = skillGroups.map((group, index) => ({
    id: `skill-${index}`,
    kind: "skill",
    title: group.title,
    tags: [...group.items, "기술스택"],
    content: `스택: ${group.items.join(", ")}`,
  }));

  return [
    profileDoc,
    ...projectDocs,
    ...achievementDocs,
    ...troubleshootingDocs,
    ...experienceDocs,
    ...skillDocs,
  ];
}

export function findRelevantDocuments(
  query: string,
  docs: KnowledgeDocument[],
  limit = DOCUMENT_FALLBACK_LIMIT,
) {
  const queryTokens = tokenize(query);
  const normalizedQuery = query.toLowerCase();
  const releaseIntentKeywords = [
    "출시",
    "배포",
    "런칭",
    "릴리스",
    "release",
    "launch",
  ];
  const awardIntentKeywords = ["수상", "award", "입상", "우승", "본선"];
  const hasReleaseIntent = queryTokens.some((token) =>
    includesAny(token, releaseIntentKeywords),
  );
  const hasAwardIntent = queryTokens.some((token) =>
    includesAny(token, awardIntentKeywords),
  );
  const timelineIntentKeywords = [
    "이력",
    "연도순",
    "전체",
    "전부",
    "모두",
    "목록",
    "정리",
    "history",
    "timeline",
  ];
  const hasTimelineIntent =
    queryTokens.some((token) => includesAny(token, timelineIntentKeywords)) ||
    includesAny(normalizedQuery, timelineIntentKeywords);
  const effectiveLimit =
    hasTimelineIntent && (hasReleaseIntent || hasAwardIntent)
      ? Math.max(limit, 16)
      : limit;

  if (queryTokens.length === 0) {
    return docs.slice(0, effectiveLimit);
  }

  const ranked = docs
    .map((doc) => {
      const normalizedTitle = doc.title.toLowerCase();
      const normalizedTags = doc.tags.map((tag) => tag.toLowerCase());
      const normalizedContent = doc.content.toLowerCase();
      let score = 0;

      for (const token of queryTokens) {
        if (normalizedTitle.includes(token)) {
          score += 4;
        }

        if (normalizedTags.some((tag) => tag.includes(token))) {
          score += 3;
        }

        if (normalizedContent.includes(token)) {
          score += 1;
        }
      }

      if (normalizedQuery.includes(normalizedTitle)) {
        score += 8;
      }

      if (hasReleaseIntent && includesAny(normalizedContent, releaseIntentKeywords)) {
        score += 7;
      }
      if (hasReleaseIntent && includesAny(normalizedTitle, releaseIntentKeywords)) {
        score += 7;
      }
      if (hasReleaseIntent && normalizedTags.some((tag) => includesAny(tag, releaseIntentKeywords))) {
        score += 8;
      }

      if (hasAwardIntent && includesAny(normalizedContent, awardIntentKeywords)) {
        score += 6;
      }
      if (hasAwardIntent && includesAny(normalizedTitle, awardIntentKeywords)) {
        score += 6;
      }
      if (hasAwardIntent && normalizedTags.some((tag) => includesAny(tag, awardIntentKeywords))) {
        score += 7;
      }

      return { doc, score };
    })
    .sort((a, b) => b.score - a.score);

  const scored = ranked.filter((item) => item.score > 0);
  if (hasTimelineIntent && (hasReleaseIntent || hasAwardIntent)) {
    const intentKeywords = [
      ...(hasReleaseIntent ? releaseIntentKeywords : []),
      ...(hasAwardIntent ? awardIntentKeywords : []),
    ];

    const intentMatched = scored.filter((item) => {
      const normalizedDocText = [
        item.doc.title,
        item.doc.tags.join(" "),
        item.doc.content,
      ]
        .join(" ")
        .toLowerCase();

      return intentKeywords.some((keyword) => normalizedDocText.includes(keyword));
    });

    if (intentMatched.length > 0) {
      return intentMatched.slice(0, effectiveLimit).map((item) => item.doc);
    }
  }

  const picked = scored.slice(0, effectiveLimit);
  if (picked.length > 0) {
    return picked.map((item) => item.doc);
  }

  return docs.slice(0, effectiveLimit);
}

export function buildGroundedPrompt(
  question: string,
  relevantDocs: KnowledgeDocument[],
  conversationHistory: ConversationTurn[] = [],
) {
  const context = relevantDocs
    .map((doc, index) =>
      [
        `[문서 ${index + 1}]`,
        `제목: ${doc.title}`,
        `유형: ${doc.kind}`,
        `태그: ${doc.tags.join(", ")}`,
        doc.url ? `출처: ${doc.url}` : "",
        `내용: ${doc.content}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  const history = conversationHistory
    .map((turn) => {
      const speaker = turn.role === "user" ? "사용자" : "도우미";
      return `[${speaker}] ${truncate(turn.text.replace(/\s+/g, " ").trim(), 220)}`;
    })
    .join("\n");

  return `당신은 포트폴리오 사이트 전용 AI 도우미입니다.

고정 프로필:
- 포트폴리오 주인(작성자) 이름: 하은영
- 포트폴리오 주인 직무: Software Engineer

규칙:
1) 반드시 CONTEXT와 고정 프로필에 있는 정보만 근거로 답변합니다.
2) 질문에서 "너", "당신", "본인", "작성자", "주인"은 포트폴리오 주인(하은영)을 의미합니다.
3) CONTEXT와 고정 프로필에 근거가 없으면 "사이트 내 정보로는 확인되지 않습니다."라고 답변합니다.
4) 과장/추측/허위 정보를 만들지 않습니다.
5) 답변 마지막에 [출처] 항목으로 참고한 문서 제목을 짧게 정리합니다.
6) 모든 답변은 한국어 존댓말로 작성합니다.
7) 질문에서 "N개/N가지/N건"처럼 개수를 요청하면, 반드시 정확히 그 개수만큼 번호 목록으로 답변합니다.
8) 목록 답변 중 항목이 부족하면 임의로 축약하지 말고 누락 없이 완결된 답변을 작성합니다.
9) 질문이 "이력/연도순/목록/전체" 정리를 요구하고 개수를 지정하지 않으면, CONTEXT에서 찾은 관련 항목을 누락 없이 모두 정리합니다.
10) 같은 이벤트를 의미하는 항목이 중복으로 보이면 한 번만 제시합니다.

CONTEXT:
${context}

이전 대화:
${history || "(이전 대화 없음)"}

질문:
${question}`;
}
