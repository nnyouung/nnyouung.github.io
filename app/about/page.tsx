import NavPill from "../../components/NavPill";
import Section from "../../components/Section";
import { awards, certifications, education } from "../../data/experience";
import { skills } from "../../data/skills";

// TODO: 강점 수정하기
const skillCards = [
  {
    title: "UI Engineering",
    description:
      "재사용 가능한 컴포넌트와 일관된 레이아웃 시스템을 설계합니다.",
    items: ["React"],
  },
  {
    title: "제목",
    description: "설명",
    items: ["내용"],
  },
  {
    title: "모바일 경험",
    description: "React Native와 Expo 기반 앱 UI를 구축하고 성능을 튜닝합니다.",
    items: ["React Native", "Expo/EAS"],
  },
  {
    title: "제목2",
    description: "설명2",
    items: ["내용2"],
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto max-w-[960px] px-6 pb-24 pt-10">
        <NavPill />

        <Section className="pb-10 pt-24" viewportOnce>
          <div className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-8 md:grid-cols-[200px_1fr]">
            <div className="flex justify-center md:justify-start">
              <img
                src="/images/profile.JPG"
                alt="프로필"
                className="h-56 w-40 rounded-3xl border border-slate-200 object-cover shadow-sm"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                About me
              </p>
              <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                깔끔한 구조와 디테일을 동시에 챙기는 프론트엔드 개발자입니다
              </h1>
              <p className="mt-4 text-sm text-slate-500 sm:text-base">
                문제를 구조적으로 정리하고, 실험과 측정을 통해 개선하는 과정을
                선호합니다. 디자인과 개발의 간격을 줄이는 정돈된 UI 구현을
                강점으로 삼고 있습니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  정돈된 UI
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  문제 해결
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  협업 문서화
                </span>
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-400">전화번호</span>
                  <span className="font-medium text-slate-700">
                    010-9292-6164
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 py-3">
                  <span className="text-slate-400">이메일</span>
                  <span className="font-medium text-slate-700">
                    hae22012@gmail.com
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-400">Github 링크</span>
                  <a
                    href="https://github.com/nnyouung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-700"
                  >
                    https://github.com/nnyouung
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section className="pb-12 pt-32" viewportOnce>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Strength
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              개발자로서의 작업 방식을 소개합니다
            </h1>
            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              사용자 경험을 개선하는 구조와 디테일을 고민하며 UI를 구현합니다.
            </p>
          </div>
        </Section>

        <Section className="pb-20" viewportOnce>
          <div className="grid gap-6 sm:grid-cols-2">
            {skillCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {card.title}
                </h2>
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
        </Section>

        <Section className="pb-20 pt-32" viewportOnce>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Skills
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
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
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section className="pb-20 pt-32" viewportOnce>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Education & Awards
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              교육 및 수상
            </h2>
            <p className="mt-3 text-m text-slate-500">
              교육 과정과 수상 내역을 정리했습니다.
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

        <Section className="pb-20 pt-32" viewportOnce>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Certifications
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
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
      </main>
    </div>
  );
}
