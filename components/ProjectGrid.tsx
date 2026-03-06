"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "../data/projects";

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
  maxItems?: number;
  variant?: "default" | "media";
  detailHrefBase?: string;
  openInNewTab?: boolean;
  prioritizePinned?: boolean;
};

export default function ProjectGrid({
  maxItems,
  variant = "default",
  detailHrefBase = "/portfolio",
  openInNewTab = false,
  prioritizePinned = false,
}: ProjectGridProps) {
  const router = useRouter();
  const sortedProjects = prioritizePinned
    ? projects
        .map((project, index) => ({ project, index }))
        .sort((a, b) => {
          if (a.project.isPinned === b.project.isPinned) {
            return a.index - b.index;
          }
          return a.project.isPinned ? -1 : 1;
        })
        .map(({ project }) => project)
    : projects;

  const visibleProjects =
    typeof maxItems === "number" ? sortedProjects.slice(0, maxItems) : sortedProjects;
  const hasMoreProjects =
    typeof maxItems === "number" && sortedProjects.length > visibleProjects.length;
  const isMedia = variant === "media";

  return (
    <div>
      <motion.div
        className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6"}
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
              const href = `${detailHrefBase}/${project.id}`;
              if (openInNewTab) {
                if (typeof window !== "undefined") {
                  window.open(href, "_blank", "noopener,noreferrer");
                }
              } else {
                router.push(href);
              }
            }}
            className={`group flex h-full cursor-pointer flex-col text-left transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-0 ${
              isMedia
                ? "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] hover:border-blue-300"
                : "rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] hover:border-blue-300"
            }`}
          >
            {isMedia ? (
              <>
                <div className="relative flex aspect-[16/14] w-full items-center justify-center overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.imageAlt ?? project.title}
                    className="w-full h-auto max-w-full object-contain"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-700/70 px-3 py-1 text-xs font-medium text-white">
                    {project.period}
                  </span>
                </div>
                <div className="flex h-full flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {project.summary ? project.summary : project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
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

      {hasMoreProjects && (
        <div className="mt-8 flex justify-center">
          <Link
            href={detailHrefBase}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] transition hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-0"
          >
            더보기
          </Link>
        </div>
      )}
    </div>
  );
}
