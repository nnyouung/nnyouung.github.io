// TODO: 상세 내용 정리할 것


export type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectLink = {
  label: string;
  url: string;
  type?: "github" | "doc" | "link";
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  imageAlt?: string;
  images?: ProjectImage[];
  links?: ProjectLink[];
  overview: string;
  roleAndContribution: string[];
  achievements?: string[];
  troubleshooting: string[];
  details: string[];
  participants: string;
  period: string;
};

const placeholderImages = (alt: string): ProjectImage[] => [
  { src: "/images/dife.png", alt },
  { src: "/images/dife.png", alt },
];

export const projects: Project[] = [
  {
    id: "tech-seminar-open-source",
    title: "기술세미나 (Open Source)",
    description:
      "Cypress와 freeCodeCamp 오픈소스에 기여하며, 버그 수정 및 테스트 코드를 작성한 기술 세미나 프로젝트입니다.",
    tech: ["TypeScript"],
    image: "/images/dife.png",
    imageAlt: "오픈소스 기여 프로젝트",
    images: placeholderImages("오픈소스 기여 프로젝트"),
    overview:
      "Cypress와 freeCodeCamp 오픈소스에 기여하며, 버그 수정 및 테스트 코드를 작성한 기술 세미나 프로젝트입니다.",
    roleAndContribution: [
      "오픈소스 기여 및 발표 역할 수행",
      "Cypress 스택 중첩 문제 해결",
      "freeCodeCamp 공유 버튼 복구",
    ],
    achievements: ["우리FISA아카데미 기술세미나 우승"],
    troubleshooting: [
      "Update branch 이후 CI에서만 Cypress 테스트가 실패하는 원인을 CI 로그로 추적",
      "cross-origin 환경에서 origin 로그 그룹 상태가 정리되지 않아 누수되는 문제 수정",
      "origin 로그 그룹의 ID/레벨 불일치로 발생하는 UI/중첩 문제 해결",
      "GUI 테스트 반영 실패가 빌드 파이프라인 문제임을 확인하고 runner watch로 해결",
    ],
    participants: "오픈소스 기여 및 발표 / 팀 프로젝트",
    period: "2025.01\n(약 1개월)",
    links: [
      { label: "발표자료", url: "https://drive.google.com/file/d/1G3ywyoGAbLRIvUtYmeLBilm9uCOCxXCe/view?usp=sharing", type: "doc" }
    ],
    details: [
      "Cypress 스택 중첩 문제 해결",
      "CI 환경 전용 테스트 실패 원인 분석",
      "우리FISA아카데미 기술세미나 우승",
    ],
  },
  {
    id: "dife-global-community",
    title: "Dife",
    description:
      "다국어 커뮤니티와 실시간 채팅을 중심으로 한 글로벌 커뮤니티 앱으로, Play Store과 App Store에 출시 완료했습니다.",
    tech: ["React Native", "JavaScript", "REST API", "WebSocket", "Expo/EAS"],
    image: "/images/dife.png",
    imageAlt: "Dife 앱 미리보기",
    images: placeholderImages("Dife 앱 미리보기"),
    overview:
      "다국어 커뮤니티와 실시간 채팅을 중심으로 한 글로벌 커뮤니티 앱으로, Play Store과 App Store에 출시 완료했습니다.",
    roleAndContribution: [
      "프론트엔드 1인 전담으로 전체 UI/상태 관리 구조 설계",
      "다국어/자동 번역, 실시간 메시징, 스몰톡 추천 기능 구현",
      "프로필 탐색 UX 및 태그 기반 필터링 설계",
    ],
    achievements: ["2025.07 App Store 출시", "2025.10 Play Store 출시"],
    troubleshooting: [
      "WebSocket 연결 끊김을 인증 토큰 검증/연결 유지 로직 불일치로 정의하고 CONNECT/SUBSCRIBE 분리로 안정화",
      "Expo SDK 업그레이드 후 iOS 빌드 Exit 65 문제를 Xcode 전체 로그로 추적해 EAS 경로 이슈로 판단 후 심볼릭 링크 생성",
      "React state 비동기 업데이트로 필터 상태와 API 전달 값 불일치 → functional update로 개선",
      "채팅 목록 재진입 시 null dereference 크래시 방지(옵셔널 체이닝) + 백엔드 협업으로 데이터 보장",
      "Android TextInput 커서 길어짐 문제를 폰트 패딩 메트릭 원인으로 규명 → 공통 래퍼 개선",
      "i18n 초기화 타이밍 문제로 언어가 튀는 현상 발생 → 서버 값 단일 진실 정책과 렌더링 게이트로 해결",
    ],
    participants: "프론트엔드 (디자이너 1, 백엔드 2, 프론트엔드 1)",
    period: "2024.04 - 2026.02 (약 1년 10개월, 진행중)",
    links: [
      { label: "GitHub", url: "https://github.com/team-diverse/dife-frontend", type: "github" }
    ],
    details: [
      "다국어/실시간 채팅 핵심 기능 구현",
      "WebSocket 안정화 및 상태 동기화 개선",
      "App Store/Play Store 출시",
    ],
  },
  {
    id: "sign-order-cafe",
    title: "Sign order",
    description:
      "카운터 앱, 메뉴 웹, 관리자 웹으로 이루어진 수어 기반 카페 주문/문의 서비스입니다.",
    tech: ["React", "JavaScript", "Kotlin", "REST API", "WebSocket", "gRPC", "MediaPipe"],
    image: "/images/dife.png",
    imageAlt: "Sign order 서비스 미리보기",
    images: placeholderImages("Sign order 서비스 미리보기"),
    overview:
      "카운터 앱, 메뉴 웹, 관리자 웹으로 이루어진 수어 기반 카페 주문/문의 서비스입니다.",
    roleAndContribution: [
      "프론트엔드 전담으로 menu-web, counter_app, admin-web UI 개발",
      "수어 인식 기반 실시간 소통 플로우 설계",
      "WebSocket과 gRPC 비교 자료를 작성해 팀 의사결정 지원",
    ],
    achievements: [
      "다학제간캡스톤디자인 졸업작품전시회 금상",
      "SW중심대학 디지털 경진대회 우수상",
      "SK AI SUMMIT 시연 및 발표",
    ],
    troubleshooting: [
      "수어 인식 처리 속도 병목을 서버 연산으로 정의 → MediaPipe 연산을 클라이언트로 이동해 응답 시간 약 50% 단축",
      "gRPC + MediaPipe 도입 후 Protobuf 중복으로 빌드 실패 → Gradle 의존성 트리 분석 후 WKT 중복 제거",
      "Gradle Task 중복 등록 및 API 비호환 → Delete Task 분리 + 조건부 등록으로 빌드 파이프라인 안정화",
      "React 18 StrictMode로 WebSocket 중복 연결/해제 경고 발생 → useRef 가드 로직으로 해결",
    ],
    participants: "프론트엔드 (백엔드 2, AI 1, 아바타 1, 프론트엔드 1)",
    period: "2025.03 - 2025.10 (약 7개월)",
    links: [
      { label: "GitHub", url: "https://github.com/nnyouung/signorder-frontend", type: "github" }
    ],
    details: [
      "수어 인식 기반 실시간 주문/문의 플로우 구현",
      "성능 병목 분석 및 MediaPipe 처리 위치 개선",
      "다학제간캡스톤디자인 졸업작품전시회 금상",
    ],
  },
  {
    id: "encore-collaboration",
    title: "Encore",
    description:
      "대학생 IT 연합 동아리 '잇타' 활동 프로젝트로, 뮤지컬 커뮤니티 서비스입니다.",
    tech: ["React Native", "TypeScript", "REST API"],
    image: "/images/dife.png",
    imageAlt: "Encore 앱 미리보기",
    images: placeholderImages("Encore 앱 미리보기"),
    overview:
      "대학생 IT 연합 동아리 '잇타' 활동 프로젝트로, 뮤지컬 커뮤니티 서비스입니다.",
    roleAndContribution: [
      "프론트엔드 개발 및 보조 기획 참여",
      "기능 난이도/예상 소요 시간을 수치화해 의사결정 기준 마련",
      "포인트 기능 범위를 조정한 ‘핵심 기능안’ 제안",
    ],
    troubleshooting: [
      "포인트 기능 도입 논의에서 일정 리스크가 커져 기능 범위를 재설계해 합의 도출",
      "의사결정 기준 부재 문제를 해결하기 위해 기능 난이도/일정 데이터를 정리",
    ],
    participants:
      "프론트엔드 및 보조 기획 (기획 1, 디자이너 1, 프론트엔드 2, 백엔드 3)",
    period: "2024.09 - 2025.01 (약 5개월)",
    links: [
      { label: "GitHub", url: "https://github.com/nnyouung/encore-frontend", type: "github" }
    ],
    details: [
      "기능 난이도/일정 분석을 통한 합의 도출",
      "핵심 기능안 제안 및 범위 조정",
      "시연 가능한 앱 완성",
    ],
  },
  {
    id: "timepay-improvement",
    title: "TimePay (서비스 개선 프로젝트)",
    description:
      "시간으로 품앗이를 진행하는 고령층 대상 앱 개선 프로젝트입니다.",
    tech: ["TypeScript"],
    image: "/images/dife.png",
    imageAlt: "TimePay 서비스 개선",
    images: placeholderImages("TimePay 서비스 개선"),
    overview:
      "시간으로 품앗이를 진행하는 고령층 대상 앱 개선 프로젝트입니다.",
    roleAndContribution: [
      "프론트엔드 개발(기존 프로젝트 개선) 담당",
      "행동 관찰/인터뷰를 통한 사용자 조사 진행",
      "로그인 버튼 문구와 플로우를 직관적으로 재설계",
    ],
    troubleshooting: [
      "카카오 소셜 로그인 도입 후 이탈률 40% 이상 증가 원인을 사용자 행태로 가정하고 조사 설계",
      "고령층 사용자 9명 관찰/인터뷰 결과, 낯선 화면에서의 심리적 장벽을 핵심 원인으로 도출",
      "전화번호 기반 로그인으로 전환하고 화면 흐름을 단순화해 이탈률 개선",
    ],
    participants: "프론트엔드 (기획 2, 프론트엔드 3)",
    period: "2022.09 - 2022.12 (약 3개월)",
    details: [
      "고령층 사용자 조사 기반 UX 개선",
      "로그인 흐름 재설계 및 이탈률 감소",
      "전화번호 기반 로그인 전환",
    ],
  },
];
