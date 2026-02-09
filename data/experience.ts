export type ExperienceItem = {
  date: string;
  title: string;
  description?: string;
};

export const education: ExperienceItem[] = [
  {
    date: "2025.12 - 2026.05",
    title: "우리FIS아카데미 6기 클라우드 서비스 개발반",
    description: "교육 과정 참여",
  },
  {
    date: "2024.09 - 2025.01",
    title: "대학생 연합 IT 동아리 잇타",
    description: "프로젝트 참여",
  },
  {
    date: "2023.03 - 2024.06",
    title: "교내 IT 동아리 KOSS",
    description: "프로젝트, 공모전, 교육 봉사 참여",
  },
  {
    date: "2021.03 - 2026.08",
    title: "국민대학교 소프트웨어학부 소프트웨어전공 학사 (2026.08 졸업 예정)",
    description: "소프트웨어전공 학사 과정 ",
  },
];

export const awards: ExperienceItem[] = [
  {
    date: "2025.08",
    title: "2025 SW중심대학 디지털 경진대회: SW부문 우수상",
    description: "258명, 58개교 참여",
  },
  {
    date: "2025.05",
    title: "다학제간캡스톤디자인 졸업작품전시회 금상",
    description: "223명, 46팀 참여",
  },
  {
    date: "2023.12",
    title:
      "제 2회 숙명여자대학교(코딧) X 국민대학교(코스) 연합 해커톤(코코톤) 장려상",
    description: "60명, 12팀 참여",
  },
  {
    date: "2023.12",
    title:
      "한국정보과학회 2023 한국소프트웨어종합학술대회 논문집 수록",
    description: "오픈소스 기반 학습 플랫폼 개발",
  },
  {
    date: "2023.12",
    title: "제 21회 임베디드 소프트웨어 경진대회 본선 진출",
    description: "본선 진출",
  },
];

export const certifications: ExperienceItem[] = [
  {
    date: "2025.09",
    title: "정보처리기사",
  },
  {
    date: "2025.09",
    title: "SQL 개발자",
  },
  {
    date: "2021.09",
    title: "GTQ그래픽기술자격 1급",
  },
];
