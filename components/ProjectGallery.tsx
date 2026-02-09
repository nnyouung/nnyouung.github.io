"use client";

import { useMemo, useState } from "react";
import type { ProjectImage } from "../data/projects";

type ProjectGalleryProps = {
  images: ProjectImage[];
};

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const filtered = useMemo(
    () => images.filter((image) => image?.src),
    [images]
  );
  const [index, setIndex] = useState(0);
  const total = filtered.length;

  if (!total) {
    return null;
  }

  const current = filtered[Math.min(index, total - 1)];

  const goPrev = () => {
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
  };

  const goNext = () => {
    setIndex((currentIndex) => (currentIndex + 1) % total);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[16/10]">
        <img
          src={current.src}
          alt={current.alt}
          className="h-full w-full object-cover"
        />
      </div>
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:text-slate-900"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:text-slate-900"
          >
            →
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs text-slate-500 shadow-sm">
            {filtered.map((image, idx) => (
              <span
                key={`${image.src}-${idx}`}
                className={`h-1.5 w-1.5 rounded-full ${
                  idx == index ? "bg-blue-500" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
