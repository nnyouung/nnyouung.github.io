"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Project } from "../data/projects";
import ProjectLinks from "./ProjectLinks";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
  detailHref?: string;
};

export default function ProjectModal({
  project,
  onClose,
  detailHref,
}: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-slate-400">프로젝트</p>
                  <h3
                    id="project-modal-title"
                    className="text-lg font-semibold text-slate-900"
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {detailHref && (
                  <a
                    href={detailHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.45)] transition hover:border-blue-300"
                  >
                    프로젝트 상세 보기
                  </a>
                )}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-800"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">역할</p>
                <p className="font-medium text-slate-700">
                  {project.participants}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">기간</p>
                <p className="font-medium text-slate-700">{project.period}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">관련 링크</p>
                <div className="mt-2">
                  <ProjectLinks links={project.links} size="compact" />
                </div>
              </div>
            </div>

            <div className="mt-6 max-h-[45vh] overflow-y-auto pr-2">
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-sm font-semibold text-slate-800">
                  상세 내용
                </h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
