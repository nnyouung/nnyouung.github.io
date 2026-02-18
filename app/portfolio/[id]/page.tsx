import Link from "next/link";
import { notFound } from "next/navigation";
import NavPill from "../../../components/NavPill";
import ProjectGallery from "../../../components/ProjectGallery";
import ProjectLinks from "../../../components/ProjectLinks";
import Section from "../../../components/Section";
import TroubleshootingSection from "../../../components/TroubleshootingSection";
import { projects } from "../../../data/projects";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const images = project.images?.length
    ? project.images
    : project.image
      ? [{ src: project.image, alt: project.imageAlt ?? project.title }]
      : [];
  const overview = project.overview ?? project.description;
  const roleAndContribution = project.roleAndContribution?.length
    ? project.roleAndContribution
    : [];
  const normalizedRoleAndContribution = roleAndContribution.map(
    (item, index) =>
      typeof item === "string"
        ? { text: item, level: index === 0 ? 0 : 1 }
        : { text: item.text, level: item.level ?? (index === 0 ? 0 : 1) },
  );
  const achievements = project.achievements?.length ? project.achievements : [];
  const achievementTypeLabel = {
    award: "수상",
    release: "출시",
    presentation: "시연",
  } as const;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto max-w-[960px] px-6 pb-24 pt-10">
        <NavPill />

        <Section className="pb-12 pt-16" enableMotion={false}>
          <div className="flex flex-col gap-6">
            <Link
              href="/portfolio"
              className="w-fit text-s font-semibold text-slate-500"
            >
              ← 포트폴리오 목록으로 돌아가기
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  Project
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:text-lg">
                  {overview}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                {project.period}
              </span>
            </div>
          </div>
        </Section>

        <Section className="pb-12" enableMotion={false}>
          <ProjectGallery images={images} />
        </Section>

        <Section className="pb-12" enableMotion={false}>
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                프로젝트 소개
              </h2>
              <p className="whitespace-pre-line mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                {project.description}
              </p>
            </div>
          </div>
        </Section>

        <Section className="pb-12" enableMotion={false}>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">사용 기술</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
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
        </Section>

        {project.links && (
          <Section className="pb-12" enableMotion={false}>
            <div>
              <p className="text-lg font-semibold text-slate-900">관련 링크</p>
              <div className="mt-3">
                <ProjectLinks links={project.links} />
              </div>
            </div>
          </Section>
        )}

        <Section className="pb-12" enableMotion={false}>
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-slate-900">
              역할 및 기여
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {normalizedRoleAndContribution.map((item, index) => (
                <li
                  key={`${item.text}-${index}`}
                  className={`marker:text-slate-400 ${
                    item.level === 0
                      ? "ml-0 font-semibold"
                      : item.level === 1
                        ? "ml-4 sm:ml-6 list-disc"
                        : "ml-8 sm:ml-10 list-[circle]"
                  }`}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {achievements.length > 0 && (
          <Section className="pb-12" enableMotion={false}>
            <h2 className="text-lg font-semibold text-slate-900">주요 성과</h2>
            <div className="mt-4 space-y-3">
              {achievements.map((item) => (
                <article key={item.id} className="w-fit">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {achievementTypeLabel[item.type]}
                      </span>
                      <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                        {item.title}
                      </p>
                      <span className="text-xs font-medium text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {item.urlLabel}
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}

        <Section className="pb-24" enableMotion={false}>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">트러블슈팅</h2>
            <div className="mt-4">
              <TroubleshootingSection items={project.troubleshooting} />
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
