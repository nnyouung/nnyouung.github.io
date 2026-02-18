"use client";

import { useEffect, useMemo } from "react";
import type { TroubleshootingItem } from "../data/projects";

type TroubleshootingModalProps = {
  item: TroubleshootingItem;
  items: TroubleshootingItem[];
  onClose: () => void;
  onSelectItem: (id: string) => void;
};

type ContentSection = {
  heading: string;
  body: string;
};

const sectionPattern = /(문제|추적|원인|해결|결과)\s*[:：]/g;

function parseSections(content: string): ContentSection[] {
  const matches = [...content.matchAll(sectionPattern)];

  if (matches.length === 0) {
    return [{ heading: "내용", body: content.trim() }];
  }

  const sections: ContentSection[] = [];

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end =
      index < matches.length - 1
        ? (matches[index + 1].index ?? content.length)
        : content.length;
    const body = content.slice(start, end).trim();

    if (body) {
      sections.push({ heading: match[1], body });
    }
  });

  return sections.length
    ? sections
    : [{ heading: "내용", body: content.trim() }];
}

export default function TroubleshootingModal({
  item,
  items,
  onClose,
  onSelectItem,
}: TroubleshootingModalProps) {
  const sections = useMemo(() => parseSections(item.content), [item.content]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const otherItems = items.filter((candidate) => candidate.id !== item.id);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-4 py-8 backdrop-blur-[2px] sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-[0_32px_90px_-45px_rgba(15,23,42,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`troubleshooting-title-${item.id}`}
      >
        <div className="z-10 border-b px-5 py-4 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">
                Troubleshooting
              </p>
              <h3
                id={`troubleshooting-title-${item.id}`}
                className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl"
              >
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {item.summary}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
              aria-label="트러블슈팅 모달 닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="15" y1="6" x2="6" y2="15" />
                <line x1="6" y1="6" x2="15" y2="15" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto px-5 pb-6 pt-5 sm:max-h-[calc(100vh-15rem)] sm:px-7">
          <div className="space-y-4">
            {sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {section.heading}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
                  {section.body}
                </p>
              </article>
            ))}

            {item.lesson && (
              <article className="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  배운 점
                </p>
                <p className="mt-2 text-sm leading-relaxed text-blue-900 sm:text-base">
                  {item.lesson}
                </p>
              </article>
            )}
          </div>

          {otherItems.length > 0 && (
            <div className="mt-7 border-t border-slate-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                다른 트러블슈팅 보기
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherItems.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => onSelectItem(candidate.id)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {candidate.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
