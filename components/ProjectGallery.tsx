// TODO: 포트폴리오 사진 확대 시 화살표 위치 고정

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectImage } from "../data/projects";

type ProjectGalleryProps = {
  images: ProjectImage[];
};

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const filtered = useMemo(
    () => images.filter((image) => image?.src),
    [images],
  );
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
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

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        return;
      }

      if (event.key === "ArrowLeft" && total > 1) {
        event.preventDefault();
        setIndex((currentIndex) => (currentIndex - 1 + total) % total);
        return;
      }

      if (event.key === "ArrowRight" && total > 1) {
        event.preventDefault();
        setIndex((currentIndex) => (currentIndex + 1) % total);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, total]);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex aspect-[16/9] items-center justify-center bg-white">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="이미지 크게 보기"
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src={current.src}
              alt="프로젝트 이미지"
              className="h-full w-full cursor-zoom-in object-contain"
            />
          </button>
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

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsLightboxOpen(false)}
          role="presentation"
        >
          <div
            className="relative inline-flex max-h-[94vh] max-w-[96vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <img
              src={current.src}
              alt="프로젝트 이미지 원본"
              className="max-h-[94vh] w-auto max-w-full object-contain"
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="이전 이미지"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="다음 이미지"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
