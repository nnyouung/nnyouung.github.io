"use client";

import type { ProjectLink } from "../data/projects";

type ProjectLinksProps = {
  links?: ProjectLink[];
  linkLabel?: string;
  linkUrl?: string;
  size?: "compact" | "regular";
};

const resolveType = (link: ProjectLink): ProjectLink["type"] => {
  if (link.type) return link.type;
  const label = link.label.toLowerCase();
  if (label.includes("git")) return "github";
  if (
    label.includes("발표") ||
    label.includes("문서") ||
    label.includes("자료")
  ) {
    return "doc";
  }
  return "link";
};

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.1-1.49-1.1-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.38-2.04 1.02-2.76-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.5.1 2.75.64.72 1.02 1.64 1.02 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
  </svg>
);

export default function ProjectLinks({
  links,
  size = "regular",
}: ProjectLinksProps) {
  if (!links?.length) {
    return <p className="text-sm font-semibold text-slate-700">없음</p>;
  }

  const base =
    size === "compact" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm sm:text-base";

  return (
    <div className="flex flex-wrap gap-2">
      {links?.map((link) => {
        const type = resolveType(link);
        return (
          <a
            key={`${link.url}-${link.label}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 ${base}`}
          >
            {type === "github" && (
              <GithubIcon className="h-4 w-4 text-slate-600" />
            )}
            {type === "doc" && <span className="text-slate-500">📋</span>}
            {type === "link" && <span className="text-slate-500">🔗</span>}
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
