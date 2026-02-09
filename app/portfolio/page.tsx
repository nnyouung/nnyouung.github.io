import NavPill from "../../components/NavPill";
import ProjectGrid from "../../components/ProjectGrid";
import Section from "../../components/Section";

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto max-w-[960px] px-6 pb-24 pt-10">
        <NavPill />

        <Section className="pb-12 pt-16" viewportOnce>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Portfolio
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              프로젝트 상세 내용을 확인하세요
            </h1>
            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              역할, 기술 스택, 문제 해결 과정을 중심으로 정리했습니다.
            </p>
          </div>
        </Section>

        <Section className="pb-20" viewportOnce>
          <ProjectGrid
            showTitle={false}
            showMore={false}
            variant="media"
            useModal={false}
            detailHrefBase="/portfolio"
          />
        </Section>
      </main>
    </div>
  );
}
