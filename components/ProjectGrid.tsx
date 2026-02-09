"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";
import ProjectModal from "./ProjectModal";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type ProjectGridProps = {
  showTitle?: boolean;
  showMore?: boolean;
  showMoreHref?: string;
  maxItems?: number;
  variant?: "default" | "media";
  useModal?: boolean;
  detailHrefBase?: string;
};

export default function ProjectGrid({
  showTitle = true,
  showMore = true,
  showMoreHref,
  maxItems,
  variant = "default",
  useModal = true,
  detailHrefBase = "/portfolio",
}: ProjectGridProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const router = useRouter();
  const visibleProjects =
    typeof maxItems === "number" ? projects.slice(0, maxItems) : projects;
  const isMedia = variant === "media";
  const detailHref = selected ? `${detailHrefBase}/${selected.id}` : undefined;

  return (
    <div>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            주요 프로젝트
          </h2>
          <p className="mt-3 text-m text-slate-500">
            그동안 수행한 프로젝트 중 주요 프로젝트를 소개합니다.
          </p>
        </div>
      )}

      <motion.div
        className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
          showTitle ? "mt-10" : "mt-6"
        }`}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {visibleProjects.map((project) => (
          <motion.button
            key={project.id}
            type="button"
            variants={item}
            onClick={() => {
              if (useModal) {
                setSelected(project);
              } else {
                router.push(`${detailHrefBase}/${project.id}`);
              }
            }}
            className={`group flex h-full flex-col text-left transition hover:-translate-y-1 ${
              isMedia
                ? "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]"
                : "rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]"
            }`}
          >
            {isMedia ? (
              <>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.imageAlt ?? project.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white">
                    {project.period}
                  </span>
                </div>
                <div className="flex h-full flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate-100 px-2.5 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-slate-100 px-2 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          </motion.button>
        ))}
      </motion.div>

      {showMore && (
        <div className="mt-10 flex justify-center">
          {showMoreHref ? (
            <Link
              href={showMoreHref}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              더 보기
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              더 보기
            </button>
          )}
        </div>
      )}

      {useModal && (
        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          detailHref={detailHref}
        />
      )}
    </div>
  );
}
