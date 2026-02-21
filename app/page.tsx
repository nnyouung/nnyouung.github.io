import Link from "next/link";
import NavPill from "../components/NavPill";
import ProjectGrid from "../components/ProjectGrid";
import Section from "../components/Section";
import { awards, certifications, education } from "../data/experience";
import { skillGroups } from "../data/skills";

const skillCards = [
  {
    title: "사용자 체감 성능 최적화",
    description:
      "사용자 흐름을 기준으로 병목을 찾고, 체감되는 지점을 우선 개선합니다.",
    items: ["렌더링 최적화", "지연 제거", "사용자 기반 개선"],
  },
  {
    title: "문제 재현 & 안정화",
    description:
      "환경 차이, 타이밍 이슈처럼 재현이 어려운 문제를 끝까지 따라가 원인을 해결합니다.",
    items: ["재현 조건 정리", "원인 분리", "트러블슈팅 기록"],
  },

  {
    title: "AI 기반 기능 구현",
    description:
      "AI를 단순히 실행하는 것이 아니라, 서비스 UX 안에서 자연스럽게 작동하도록 고민합니다.",
    items: ["AI 기능 설계", "UX 흐름 통합"],
  },
  {
    title: "균형있는 협업",
    description:
      "팀 상황에 따라 제안자와 정리자 역할을 바꾸며 합의된 방향으로 실행합니다.",
    items: ["의견 구조화", "문서화", "결정 지원"],
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto max-w-[960px] px-6 pb-24 pt-10">
        <NavPill />

        <Section className="min-h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              HA EUN YEONG
            </p>
            <h1 className="mt-6 text-3xl sm:text-5xl font-semibold leading-[36px] sm:leading-[60px] text-slate-900">
              안녕하세요,
              <br />
              원인 추적으로 완성도를 만드는
              <br />
              개발자
              <span className="text-blue-600"> 하은영</span>입니다.
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-500 sm:text-lg">
              재현이 어려운 문제를 끝까지 추적해 원인을 정의하고,
              <br />
              배포 환경까지 포함해 안정적으로 해결합니다.
            </p>
          </div>
        </Section>

        <Section id="about" className="py-16">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              About me
            </p>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="shrink-0">
                <img
                  src="/images/profile.JPG"
                  alt="프로필"
                  className="h-40 w-28 rounded-3xl border border-slate-200 object-cover shadow-sm sm:h-56 sm:w-40"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                        하은영
                      </h2>
                      <span className="text-base font-semibold text-slate-500 sm:text-xl">
                        Software Engineer
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href="mailto:hae22012@gmail.com"
                      aria-label="Email"
                      className="group rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/nnyouung"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="group rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.088 2.91.832.09-.646.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.505.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.936.36.31.68.92.68 1.854 0 1.337-.012 2.416-.012 2.744 0 .268.18.577.688.48A10.016 10.016 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                    <a
                      href="https://velog.io/@nnyouung/posts"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Velog"
                      className="group rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg
                        viewBox="0 0 256 256"
                        className="h-5 w-5 fill-current"
                      >
                        <path d="M209.7 54.5c-7.7-4.5-17.6-1.9-22.1 5.8L128 165.4 68.4 60.3c-4.5-7.7-14.4-10.3-22.1-5.8-7.7 4.5-10.3 14.4-5.8 22.1l73.3 128.6c2.9 5 8.2 8.1 14 8.1s11.1-3.1 14-8.1l73.3-128.6c4.5-7.7 1.9-17.6-5.8-22.1z" />
                        <circle cx="214" cy="200" r="18" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    사용자 흐름
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    성능 개선
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    원인 추적
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    UX/AX
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    협업 유연성
                  </span>
                </div>

                <p className="mt-5 text-sm text-slate-500 sm:text-base">
                  - CI, 빌드, 실시간 통신, 플랫폼별 UI처럼 재현이 어려운 문제도
                  끝까지 추적해 해결합니다.
                  <br />
                  - 최신 기술 트렌드를 학습하고, 서비스에 적용할 때 사용자가
                  자연스럽게 경험하도록 고민합니다.
                  <br />- 팀에서는 제안자와 정리자 역할을 오가며, 논의를 정리해
                  빠르게 합의에 도달하도록 돕습니다.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {skillCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {card.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="projects" className="py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Portfolio
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              포트폴리오
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              여러 프로젝트의 상세 내용을 확인합니다.
            </p>
            <ProjectGrid maxItems={3} variant="media" openInNewTab />
          </div>
        </Section>

        <Section id="skills" className="py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Tech Stack
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              기술
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              깔끔한 UI와 안정적인 구조를 위한 핵심 기술 스택입니다.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {group.title}
                </h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" className="py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Education & Awards
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              교육 및 수상
            </h2>
            <p className="mt-3 text-sm text-slate-500">
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

        <Section id="certifications" className="py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Certifications
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              자격증
            </h2>
            <p className="mt-3 text-sm text-slate-500">
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
                <h4 className="mt-2 text-sm font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" className="py-24 pt-44">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  Explore
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  더 알고 싶으시다면?
                </h2>
                <p className="mt-3 text-sm text-slate-500">
                  소개와 포트폴리오, 깃허브에서 더 자세한 내용을 확인할 수
                  있습니다.
                </p>
              </div>
              <span className="text-xs text-slate-400">Updated 2026.02</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link
                href="/portfolio"
                className="group rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:ring-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                      01
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
                      02
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
                  코드 기록을 살펴볼 수 있습니다.
                </p>
              </a>
              <a
                href="https://velog.io/@nnyouung/posts"
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
                      <p className="text-xs text-slate-400">Velog</p>
                      <h3 className="text-base font-semibold text-slate-900">
                        벨로그
                      </h3>
                    </div>
                  </div>
                  <span className="text-slate-300 transition group-hover:text-slate-900">
                    →
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  회고와 공부 기록을 확인할 수 있습니다.
                </p>
              </a>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
