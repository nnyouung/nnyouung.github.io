import Link from "next/link";
import NavPill from "../components/NavPill";
import ProjectGrid from "../components/ProjectGrid";
import Section from "../components/Section";
import { awards, certifications, education } from "../data/experience";
import { skills } from "../data/skills";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto max-w-[960px] px-6 pb-24 pt-10">
        <NavPill />

        <Section className="pb-28 pt-48">
          <div className="flex flex-col items-center text-center">
            <h1 className="mt-8 text-4xl font-semibold leading-tight text-slate-900 sm:text-6xl">
              안녕하세요,
              <br />
              프론트엔드 개발자
              <br />
              <span className="text-blue-600">하은영</span>입니다.
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-500 sm:text-lg">
              사용자를 위한 깔끔한 경험과 정돈된 UI를 고민하는 프론트엔드
              개발자입니다.
            </p>
            {/* TODO: 이력서 연결해놓기 */}
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-700 shadow-[0_8px_20px_-12px_rgba(37,99,235,0.4)] transition hover:border-blue-300"
            >
              <span className="text-base">⬇</span>
              이력서 다운로드
            </button>
          </div>
        </Section>

        <Section
          id="skills"
          className="pt-32 pb-24"
          viewportAmount={0.4}
          delay={0.05}
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              기술
            </h2>
            <p className="mt-3 text-m text-slate-500">
              깔끔한 UI와 안정적인 구조를 위한 핵심 기술 스택입니다.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-m text-slate-600 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section id="projects" className="py-24">
          <ProjectGrid maxItems={3} variant="media" showMoreHref="/portfolio" />
        </Section>

        <Section id="experience" className="py-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              교육 및 수상
            </h2>
            <p className="mt-3 text-m text-slate-500">
              지금까지의 교육 내용과 수상 내역입니다.
            </p>
          </div>

          <div className="mt-14">
            <h3 className="text-base font-semibold text-slate-900">교육</h3>
            <div className="mt-6 space-y-8 border-l border-slate-200 pl-6">
              {education.map((item) => (
                <div key={item.title} className="relative">
                  <span className="absolute -left-[11px] top-2 h-3 w-3 rounded-full bg-blue-400" />
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-start">
                    <p className="text-sm text-slate-400 sm:text-right">
                      {item.date}
                    </p>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h4 className="text-base font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-base font-semibold text-slate-900">수상</h3>
            <div className="mt-6 space-y-8 border-l border-slate-200 pl-6">
              {awards.map((item) => (
                <div key={item.title} className="relative">
                  <span className="absolute -left-[11px] top-2 h-3 w-3 rounded-full bg-blue-400" />
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-start">
                    <p className="text-sm text-slate-400 sm:text-right">
                      {item.date}
                    </p>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h4 className="text-base font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="certifications" className="py-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              자격증
            </h2>
            <p className="mt-3 text-m text-slate-500">
              실무와 학습을 위해 취득한 자격을 모았습니다.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center"
              >
                <p className="text-xs text-slate-400">{item.date}</p>
                <h4 className="mt-2 text-m font-semibold text-slate-900">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" className="py-24 pt-48">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  Explore
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  더 알고 싶으시다면?
                </h2>
                <p className="mt-3 text-m text-slate-500">
                  소개와 포트폴리오, 깃허브에서 더 자세한 내용을 확인할 수
                  있습니다.
                </p>
              </div>
              <span className="text-xs text-slate-400">Updated 2026.02</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link
                href="/about"
                className="group rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:ring-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                      01
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">About</p>
                      <h3 className="text-base font-semibold text-slate-900">
                        소개 페이지
                      </h3>
                    </div>
                  </div>
                  <span className="text-slate-300 transition group-hover:text-slate-900">
                    →
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  작업 방식과 강점을 소개합니다.
                </p>
              </Link>
              <Link
                href="/portfolio"
                className="group rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:ring-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                      02
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">Portfolio</p>
                      <h3 className="text-base font-semibold text-slate-900">
                        포트폴리오
                      </h3>
                    </div>
                  </div>
                  <span className="text-slate-300 transition group-hover:text-slate-900">
                    →
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  프로젝트 상세 내용을 확인합니다.
                </p>
              </Link>
              <a
                href="https://github.com/nnyouung"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:ring-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                      03
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">GitHub</p>
                      <h3 className="text-base font-semibold text-slate-900">
                        깃허브
                      </h3>
                    </div>
                  </div>
                  <span className="text-slate-300 transition group-hover:text-slate-900">
                    →
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  코드와 기록을 살펴볼 수 있습니다.
                </p>
              </a>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
