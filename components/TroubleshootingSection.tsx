"use client";

import { useMemo, useState } from "react";
import type { TroubleshootingItem } from "../data/projects";
import TroubleshootingModal from "./TroubleshootingModal";

type TroubleshootingSectionProps = {
  items: TroubleshootingItem[];
};

function sortItems(items: TroubleshootingItem[]) {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.title.localeCompare(b.title, "ko");
  });
}

export default function TroubleshootingSection({
  items,
}: TroubleshootingSectionProps) {
  const sortedItems = useMemo(() => sortItems(items), [items]);
  const featuredItems = useMemo(
    () => sortedItems.filter((item) => item.isFeatured).slice(0, 3),
    [sortedItems],
  );

  const [expanded, setExpanded] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const initialItems = featuredItems.length > 0 ? featuredItems : sortedItems.slice(0, 3);
  const visibleItems = expanded ? sortedItems : initialItems;
  const activeItem =
    activeItemId === null
      ? null
      : sortedItems.find((item) => item.id === activeItemId) ?? null;

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-6 text-sm text-slate-500">
        아직 등록된 트러블슈팅이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveItemId(item.id)}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_14px_35px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {item.summary}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 transition group-hover:border-blue-200 group-hover:text-blue-600">
                상세
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {sortedItems.length > initialItems.length && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
        >
          {expanded ? "대표 항목만 보기" : `더보기 (${sortedItems.length - initialItems.length}개)`}
        </button>
      )}

      {activeItem && (
        <TroubleshootingModal
          item={activeItem}
          items={sortedItems}
          onClose={() => setActiveItemId(null)}
          onSelectItem={(id) => setActiveItemId(id)}
        />
      )}
    </>
  );
}
