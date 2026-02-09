// TODO: 가독성 좋게 정리

import Link from "next/link";
import { notFound } from "next/navigation";
import NavPill from "../../../components/NavPill";
import ProjectGallery from "../../../components/ProjectGallery";
import ProjectLinks from "../../../components/ProjectLinks";
import Section from "../../../components/Section";
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
  const achievements = project.achievements?.length ? project.achievements : [];
  const troubleshooting = project.troubleshooting?.length
    ? project.troubleshooting
    : project.details;

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
                  {project.description}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {project.participants}
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
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                {overview}
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
            <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {roleAndContribution.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </Section>

        {achievements.length > 0 && (
          <Section className="pb-12" enableMotion={false}>
            <h2 className="text-lg font-semibold text-slate-900">주요 성과</h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {achievements.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </Section>
        )}

        <Section className="pb-24" enableMotion={false}>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">트러블슈팅</h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {troubleshooting.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
