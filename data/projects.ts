/*
 TODO:
 1. 오픈소스 기여 부분, 주요 성과, 수상 내역(홈)에 관련 링크 추가
 2. 트러블슈팅, 역할 및 기여 부분 직관적으로 읽히게끔 수정
*/

export type ProjectImage = {
  src: string;
};

export type ProjectLink = {
  label: string;
  url: string;
  type?: "github" | "doc" | "link";
};

export type ProjectAchievement = {
  id: string;
  title: string;
  date: string;
  type: "award" | "release" | "presentation";
  url?: string;
  urlLabel?: string;
};

export type RoleContributionItem = {
  text: string;
  level?: 0 | 1 | 2;
};

export type TroubleshootingItem = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  isFeatured?: boolean;
  order?: number;
  lesson?: string;
};

export type Project = {
  id: string;
  title: string;
  overview: string;
  tech: string[];
  image?: string;
  imageAlt?: string;
  images?: ProjectImage[];
  links?: ProjectLink[];
  summary?: string;
  description: string;
  roleAndContribution: RoleContributionItem[];
  achievements?: ProjectAchievement[];
  troubleshooting: TroubleshootingItem[];
  period: string;
};

export const projects: Project[] = [
  {
    id: "dife-global-community",
    title: "Dife",
    overview:
      "팀 프로젝트",
    tech: ["React Native", "JavaScript", "REST API", "WebSocket", "Expo/EAS"],
    image: "/images/dife-1.png",
    imageAlt: "Dife 앱 미리보기",
    images: [{ src: "/images/dife-1.png" }, { src: "/images/dife-2.png" }, { src: "/images/dife-3.png" }],
    description:
      "다국어 커뮤니티와 실시간 채팅을 중심으로, 한국 문화에 관심 있는 외국인과 한국인을 연결하는 모바일 글로벌 서비스입니다.\n언어와 문화의 장벽을 넘어, 공통의 관심사를 바탕으로 자연스러운 소통과 교류를 돕습니다.",
    roleAndContribution: [
      { text: "프론트엔드 전담 (디자이너 1, 백엔드 2, 프론트엔드 1)", level: 0 },
      { text: "사용자 설정 언어 기반 번역 기능 제공", level: 1 },
      { text: "한국어, 영어, 일본어, 중국어, 스페인어 총 5개 국어 지원", level: 1 },
      { text: "실시간 채팅 기능 및 자연스러운 대화를 위한 스몰톡 주제 추천 기능 구현", level: 1 },
      { text: "태그 기반 커뮤니티 기능 설계 및 구현", level: 1 },
      { text: "프로필 탐색 UX 및 필터링 설계 및 구현", level: 1 },
    ],
    achievements: [
      {
        id: "dife-play-store-release",
        title: "Play Store 출시",
        type: "release",
        date: "2025.10",
        url: "https://play.google.com/store/apps/details?id=com.teamdiverse.dife&hl=ko",
        urlLabel: "관련 링크"
      },
      {
        id: "dife-app-store-release",
        title: "App Store 출시",
        type: "release",
        date: "2025.07",
        url: "https://apps.apple.com/kr/app/dife/id6670191789",
        urlLabel: "관련 링크"
      },
    ],
    troubleshooting: [
      {
        id: "websocket-auth-flow-instability",
        title: "WebSocket 연결 불안정 원인 구조화",
        summary:
          "연결과 인증 단계의 순서 불일치를 구조도로 재검증해 CONNECT/SUBSCRIBE 분리로 실시간 채팅 안정성을 확보했습니다.",
        tags: ["React Native", "WebSocket", "Auth", "Realtime"],
        content: `문제: 실시간 채팅에서 연결이 간헐적으로 끊기고 재연결이 반복되어 사용자 대화 흐름이 자주 중단됐습니다. 백엔드와 프론트엔드가 각자 코드를 점검했지만 즉시 원인을 특정하지 못했고, 백엔드 팀 리소스도 제한적이었습니다.
          추적: 담당 영역만 보는 대신 평소 리뷰했던 시스템 흐름을 기준으로 인증, 연결 수립, 구독 단계의 실제 호출 순서를 다이어그램으로 재구성했습니다. 로그 타임스탬프를 매칭하자 토큰 검증 시점과 세션 유지 로직이 어긋나는 구간이 반복적으로 나타났습니다.
          원인: 인증이 확정되기 전에 연결 유지 로직이 먼저 실행되면서 서버에서 세션을 안정적으로 고정하지 못했고, 이후 구독 단계에서 실패가 누적됐습니다.
          해결: 연결 절차를 CONNECT와 SUBSCRIBE로 분리하고, 연결 요청 전에 인증 검증이 완료되도록 순서를 재정의했습니다.
          결과: 연결 안정성이 개선되어 채팅 끊김 빈도가 크게 줄었고, 출시 단계에서 핵심 실시간 기능 품질을 확보할 수 있었습니다. 릴리스 직전 장애 대응 부담도 함께 낮출 수 있었습니다.`,
        isFeatured: true,
        order: 1,
        lesson:
          "실시간 이슈는 코드 라인보다 프로토콜 순서와 상태 전이가 먼저 정리되어야 빠르게 해결됩니다.",
      },
      {
        id: "i18n-initialization-flicker",
        title: "로그인 단계별 언어 튐 현상 제거",
        summary:
          "로그인 전·후 i18n 초기화 타이밍 차이를 정책으로 정리하고 렌더링 게이트를 추가해 언어 일관성을 확보했습니다.",
        tags: ["i18n", "React Native", "State Sync", "UX"],
        content: `문제: 글로벌 사용자 대상 앱에서 첫 진입 언어가 로그인 전/후와 자동 로그인 과정마다 달라져 화면 언어가 반복적으로 바뀌는 현상이 발생했습니다. 이는 서비스 이해도에 직접 영향을 주는 품질 문제였습니다.
          추적: 앱 시작부터 인증 완료까지 i18n 초기화 지점을 순서대로 계측해 보니, 기기 언어와 서버 언어를 읽는 시점이 분기마다 달라 동일 세션에서도 값이 역전되는 구간이 있었습니다.
          원인: 언어 선택 기준이 단일 원천으로 정의되지 않아 초기 렌더링과 사용자 설정 동기화가 경쟁 상태를 만들고 있었습니다.
          해결: 로그인 전에는 기기 언어를 사용하고, 로그인 후 최초 1회는 기기 언어를 서버에 저장한 뒤 이후에는 서버 값을 단일 진실로 사용하도록 정책을 고정했습니다. 동시에 동기화 완료 전 렌더링을 지연하는 게이트를 추가했습니다.
          결과: 첫 로그인부터 재로그인까지 언어가 일관되게 유지됐고, 다국어 사용자 온보딩 경험이 안정화됐습니다. 첫 화면에서 언어가 바뀌는 불신 구간도 제거됐습니다.`,
        isFeatured: true,
        order: 2,
        lesson:
          "다국어 품질은 번역량보다 초기화 순서와 단일 데이터 원천 정의가 더 큰 영향을 준다는 점을 배웠습니다.",
      },
      {
        id: "expo-ios-exit65-codegen-path",
        title: "Expo SDK 54 이후 iOS Exit 65 해결",
        summary:
          "Fastlane 요약 대신 Xcode 전체 로그를 분석해 ReactCodegen 경로 해석 오류를 찾아 EAS 훅으로 우회했습니다.",
        tags: ["Expo", "EAS", "iOS Build", "Codegen"],
        content: `문제: Expo SDK 54 업그레이드 이후 iOS 빌드가 Exit 65로 계속 실패했고, signing/provisioning/코드 오류 등 일반 원인을 순서대로 배제해도 해결되지 않았습니다.
          추적: 요약 로그만 보면 단서가 부족해 Xcode 전체 로그를 직접 확인했고, 실패 지점이 'ReactCodegen Generate Specs' 단계임을 확인했습니다. 이후 로그를 따라가며 참조 경로를 점검하자 Codegen이 프로젝트 루트가 아닌 '/Users/expo/package.json'을 찾다가 중단되는 패턴을 발견했습니다.
          원인: 로컬 소스 문제가 아니라 EAS 클라우드 빌드 환경에서의 경로 해석 이슈였고, New Architecture를 끄는 일반 해법은 'react-native-reanimated'와 충돌해 적용이 어려웠습니다.
          해결: 아키텍처는 유지한 채 EAS 빌드 훅에서 실제 'package.json'을 해당 경로에 심볼릭 링크로 제공해 Codegen 입력 경로를 보정했습니다.
          결과: ReactCodegen 단계가 안정적으로 통과되며 iOS 빌드 파이프라인을 복구했고, 향후 SDK 업그레이드 대응 시 로그 분석 기준을 문서화했습니다.`,
        isFeatured: true,
        order: 3,
      },
      {
        id: "filter-modal-async-state-mismatch",
        title: "필터 모달 중첩 선택 버그 개선",
        summary:
          "비동기 state 업데이트로 생긴 체크 상태와 API 파라미터 불일치를 functional update로 일관화했습니다.",
        tags: ["React Native", "State", "Filter", "UX"],
        content: `문제: 필터 모달에서 언어를 바꾸면 이전 선택 조건이 남아 중첩 필터링이 발생했고, UI 체크 상태와 실제 API 요청 값이 달라 사용자 관점에서 예측 불가능한 결과가 나왔습니다.
          추적: 이벤트 직후 state를 읽어 다음 상태를 계산하는 구간을 중심으로 값 흐름을 비교한 결과, React 비동기 업데이트 타이밍 때문에 계산 기준이 서로 다른 순간의 값을 참조하는 문제를 확인했습니다.
          원인: 관련 상태가 각각 독립적으로 갱신되며 기준 값이 분산됐고, 일부 로직은 오래된 스냅샷을 사용해 선택/해제/재선택 순서에서 누적 오차가 발생했습니다.
          해결: 이전 상태를 입력으로 사용하는 functional update 패턴으로 갱신 경로를 통일하고, 체크 계산값을 단일 기준으로 삼아 파생 상태와 API 파라미터를 동시에 업데이트하도록 구조를 정리했습니다.
          결과: 필터 동작이 사용자 기대와 일치하게 복구됐고, 상태 변경 시점에 따른 간헐 오류를 제거해 검색 경험의 신뢰도를 높였습니다. QA 재현 케이스도 단순해져 검증 속도가 개선됐습니다.`,
        order: 4,
      },
      {
        id: "chatroom-null-dereference",
        title: "채팅 재진입 null dereference 크래시 대응",
        summary:
          "`singleChatroom` null 데이터로 발생하던 런타임 오류를 방어 코드와 백엔드 데이터 보장으로 동시에 해결했습니다.",
        tags: ["React Native", "Runtime Error", "Defensive Coding", "Collaboration"],
        content: `문제: 채팅 목록에서 재진입할 때 간헐적으로 'Cannot read property id of null' 오류가 발생해 일부 사용자가 채팅 화면에 들어가지 못했습니다.
          추적: 메시지 페이로드를 단계별로 로깅해 비교한 결과, 특정 히스토리 데이터에서 'singleChatroom' 필드가 null로 내려오고 있음을 확인했습니다. 이 값이 렌더링 키와 이동 파라미터에 직접 사용되면서 예외가 발생했습니다.
          원인: 프론트에서 null 가능성을 가정하지 않은 접근과 백엔드 데이터 일관성 부족이 동시에 존재해, 특정 타이밍에 null dereference가 노출됐습니다.
          해결: 프론트는 optional chaining과 대체 값을 적용해 즉시 크래시를 차단하고, 백엔드에는 히스토리 메시지에 채팅방 식별자를 항상 포함하도록 스키마 보완을 요청해 반영했습니다.
          결과: 재진입 경로 런타임 오류가 제거됐고, 예외 대응과 데이터 계약 개선을 병행하는 협업 방식이 팀 내 표준으로 자리잡았습니다. 사용자 오류 제보 빈도도 눈에 띄게 감소했습니다.`,
        order: 5,
      },
      {
        id: "android-textinput-cursor-height",
        title: "Android TextInput 커서 길어짐 보정",
        summary:
          "Android 폰트 패딩 메트릭 차이를 원인으로 확인해 단일/멀티라인 분리 전략으로 공통 입력 래퍼를 개선했습니다.",
        tags: ["React Native", "Android", "TextInput", "UI Bug"],
        content: `문제: Android에서 입력값이 비어 있을 때 TextInput 커서가 비정상적으로 길어져 시각적 완성도를 떨어뜨렸고, 동일 화면이 iOS에서는 정상이라 플랫폼 차이 분석이 필요했습니다.
          추적: React Native TextInput이 Android EditText 기반이라는 점을 기준으로 폰트 메트릭과 기본 패딩 동작을 확인했습니다. 테스트 화면에서 'includeFontPadding' 옵션과 수직 정렬 값을 조합해 실험하자 커서 높이 변화가 재현 가능하게 관측됐습니다.
          원인: 텍스트가 없어도 폰트 상하 패딩 영역이 레이아웃 계산에 포함되며 커서 높이가 과대 계산되는 Android 기본 동작이었습니다.
          해결: 단일 입력 컴포넌트에는 'includeFontPadding: false'와 수직 정렬 보정을 기본 적용하고, 멀티라인은 줄 정렬 부작용을 고려해 기존 동작을 유지하도록 공통 TextInput 래퍼를 분기 설계했습니다.
          결과: Android 전반의 커서 길어짐 이슈가 재발 없이 정리됐고, 플랫폼별 UI 보정 정책을 컴포넌트 레벨로 고정해 유지보수성을 높였습니다.`,
        order: 6,
      },
    ],
    period: "2024.04 - 2026.02 (약 1년 10개월, 진행중)",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/team-diverse/dife-frontend",
        type: "github",
      },
    ],
  },
  {
    id: "tech-seminar-open-source",
    title: "기술세미나 (Open Source)",
    overview:
      "우리FISA",
    tech: ["TypeScript", "Cypress"],
    image: "/images/tech-seminar-open-source-1.png",
    imageAlt: "오픈소스 기여 프로젝트",
    images: [{ src: "/images/tech-seminar-open-source-1.png" }, { src: "/images/tech-seminar-open-source-2.jpeg" }],
    description:
      "오픈소스를 주제로, Cypress와 freeCodeCamp에 기여하며 버그 수정과 테스트 코드 작성 과정을 발표한 기술 세미나 프로젝트입니다.",
    roleAndContribution: [
      { text: "오픈소스 기여 (Cypress, freeCodeCamp)", level: 0 },
      { text: "Cypress 스택 중첩 문제 해결", level: 1 },
      { text: "freeCodeCamp 공유 버튼 복구", level: 1 },
      { text: "오픈소스 기여 과정과 문제 해결 경험을 주제로 기술 세미나 발표 준비", level: 1 },
    ],
    achievements: [
      {
        id: "fisa-seminar-winner",
        title: "우리FISA아카데미 기술세미나 우승",
        type: "award",
        date: "2026.01",
      },
    ],
    troubleshooting: [
      {
        id: "ci-failure-after-update-branch",
        title: "Update branch 직후 CI 실패 원인 추적",
        summary:
          "로컬은 통과했지만 CI에서만 실패한 Cypress 테스트를 병합 커밋 단위로 추적해 원인을 분리했습니다.",
        tags: ["Cypress", "CI", "Git", "Debugging"],
        content: `문제: PR에서 Update branch를 수행한 뒤부터 Cypress 단계가 CI에서만 실패했고, 같은 커밋이 로컬에서는 재현되지 않아 단순 코드 오류인지 환경 영향인지 판단이 어려웠습니다.
          추적: 실패한 최초 스텝과 로그 타임라인을 기준으로 Update branch 시점에 유입된 커밋을 목록화하고, 테스트 설정/러너/관련 모듈 변경 파일을 우선으로 영향 범위를 좁혔습니다. 이후 실패 시나리오와 연관된 테스트를 분리 실행해 조건 차이를 확인했습니다.
          원인: 제 커밋 자체보다 베이스 브랜치 변경으로 테스트 전제가 바뀌면서 기존 코드의 잠재 버그가 CI 조건에서 드러난 상태였습니다.
          해결: 리버트 대신 원인 코드 경로를 수정하고, 같은 경로를 검증하는 테스트 케이스를 보완해 재발 조건을 차단했습니다.
          결과: CI 실패를 단기 우회가 아닌 근본 수정으로 마무리했습니다.`,
        isFeatured: true,
        order: 1,
        lesson:
          "CI 전용 실패는 코드 자체와 병합 맥락을 함께 봐야 해결 속도와 정확도가 올라간다는 기준을 얻었습니다.",
      },
      {
        id: "cross-origin-log-state-leak",
        title: "Cypress cross-origin 로그 상태 누수 수정",
        summary:
          "일부 종료 경로에서 정리되지 않던 origin 로그 그룹 상태를 공통 cleanup으로 통합해 누수를 제거했습니다.",
        tags: ["Cypress", "State Management", "Cross Origin", "Bug Fix"],
        content: `문제: cross-origin 테스트 이후 생성되는 로그가 다음 테스트에서 잘못된 그룹으로 묶이며, 로그 중첩과 표시 순서가 어긋나는 현상이 반복됐습니다.
          추적: origin 로그 그룹 상태가 생성/해제되는 지점을 실행 흐름별로 추적한 결과, 정상 종료 경로에서는 상태가 해제되지만 early return 또는 예외 처리 경로에서는 해제가 건너뛰어지는 패턴을 확인했습니다.
          원인: 상태 초기화 로직이 분기별로 흩어져 있어 특정 exit path에서 cleanup이 보장되지 않았고, 이전 테스트 상태가 다음 테스트로 전파되는 누수가 발생했습니다.
          해결: 종료 분기마다 중복으로 흩어진 정리 코드를 공통 cleanup 경로로 통합하고, 모든 종료 지점에서 동일한 정리 루틴이 실행되도록 제어 흐름을 재구성했습니다.
          결과: 테스트 간 상태 오염이 사라져 로그 그룹 일관성이 회복됐고, 예외/조기 종료 경로까지 포함해 검증해야 한다는 점을 코드 리뷰 기준으로 정리했습니다. 재현 시나리오도 회귀 테스트 관점으로 문서화했습니다.`,
        isFeatured: true,
        order: 2,
        lesson:
          "상태 기반 코드에서는 정상 플로우보다 예외 플로우의 cleanup 보장이 품질을 좌우한다는 점을 체감했습니다.",
      },
      {
        id: "origin-log-group-id-level-mismatch",
        title: "origin 로그 그룹 ID/레벨 불일치 해결",
        summary:
          "ID는 유지되고 레벨만 재계산되던 구조를 정리해 비동기 상황에서도 로그 그룹 일관성을 확보했습니다.",
        tags: ["Cypress", "Async", "Logging", "Nullish Coalescing"],
        content: `문제: origin 로그 그룹 처리에서 ID와 레벨이 서로 다른 규칙으로 관리되어 비동기 실행 순서에 따라 로그 중첩 깊이와 UI 표시가 어긋나는 문제가 있었습니다.
          추적: 그룹 생성 시점과 갱신 시점의 변수 흐름을 비교해 보니 ID는 기존 값을 유지하는 반면, 레벨은 매번 새로 계산되어 동일 그룹에서도 값이 분리될 수 있는 구조였습니다.
          원인: 동일 엔터티를 나타내는 핵심 필드가 다른 생명주기로 갱신되며 일관성이 깨졌고, 경계 타이밍에서 경고와 시각적 불일치가 발생했습니다.
          해결: 레벨 계산에도 nullish 병합 연산자를 적용해 최초 유효 값이 있으면 유지하고, 값이 없는 경우에만 계산하도록 조정해 ID와 레벨의 갱신 정책을 통일했습니다.
          결과: 관련 CI 경고가 제거됐고, 내부 로깅 모델의 불변 조건을 명확히 정의해 후속 변경 시 회귀 가능성을 낮췄습니다. ID와 레벨의 동기화가 깨지던 사례를 회귀 케이스로 고정해 이후 변경 검증 기준도 명확해졌습니다. 로그 UI 불일치 보고 역시 줄어들었습니다.`,
        isFeatured: true,
        order: 3,
      },
      {
        id: "cypress-gui-bundle-not-updated",
        title: "Cypress GUI 미반영 이슈를 watch 빌드로 해결",
        summary:
          "CLI는 통과하지만 GUI에서 변경이 반영되지 않던 문제를 러너 번들 갱신 구조로 확인해 자동 watch로 전환했습니다.",
        tags: ["Cypress", "DX", "Build Pipeline", "Workspace"],
        content: `문제: 테스트 코드는 통과했지만 Open GUI 화면에서는 수정한 UI가 계속 이전 상태로 남아 결과가 불일치했고, 같은 코드가 실행 경로에 따라 다르게 보였습니다.
        추적: 렌더링 로직보다 실행 환경 차이에 집중해 CLI와 GUI가 참조하는 산출물을 비교했습니다. 그 결과 GUI가 러너 번들을 고정 참조하고 있어 코드 변경 후에도 번들이 자동 갱신되지 않는 흐름을 확인했습니다.
        원인: 코드 결함이 아니라 개발 환경의 빌드 파이프라인 문제였고, GUI 검증 경로에 최신 번들이 공급되지 않아 오판 가능성이 커졌습니다.
        해결: 'yarn workspace @packages/runner watch'를 적용해 변경 시 러너 번들을 자동 재빌드하도록 설정하고, GUI 확인 전 빌드 상태를 점검하는 체크 절차를 추가했습니다.
        결과: GUI에서도 수정 사항이 즉시 반영되어 검증 신뢰도가 높아졌고, 환경 차이로 인한 디버깅 소모 시간을 줄일 수 있었습니다. 실행 환경 차이로 인한 팀 내 확인 결과 편차도 줄었습니다.`,
        order: 4,
      },
    ],
    period: "2026.01 (약 1개월)",
    links: [
      {
        label: "발표자료",
        url: "https://drive.google.com/file/d/1G3ywyoGAbLRIvUtYmeLBilm9uCOCxXCe/view?usp=sharing",
        type: "doc",
      },
    ],
  },
  {
    id: "sign-order-cafe",
    title: "Sign order",
    overview:
      "SW중심대학 디지털 경진대회 / 국민대학교",
    tech: [
      "React",
      "JavaScript",
      "Kotlin",
      "REST API",
      "WebSocket",
      "gRPC",
      "MediaPipe",
    ],
    image: "/images/sign-order-1.png",
    imageAlt: "Sign order 서비스 미리보기",
    images: [{ src: "/images/sign-order-1.png" }, { src: "/images/sign-order-2.png" }, { src: "/images/sign-order-3.png" }, { src: "/images/sign-order-4.png" }, { src: "/images/sign-order-5.png" }],
    summary: "청각장애인(이하 농인)을 위한 수어 기반 카페 주문 서비스입니다. 수어 아바타 가이드, 실시간에 가까운 수어-한국어 번역 등 다양한 기술을 통해 포용적 주문 환경을 제공하며, 총 3개의 서비스로 구성되어 있습니다.",
    description:
      "청각장애인(이하 농인)을 위한 수어 기반 카페 주문 서비스입니다. 수어 아바타 가이드, 실시간에 가까운 수어-한국어 번역 등 다양한 기술을 통해 포용적 주문 환경을 제공하며, 총 3개의 서비스로 구성되어 있습니다.\n\n1. 메뉴 웹(React): 수어 아바타 애니메이션으로 메뉴 가이드를 제공하고, 주문번호를 생성하는 웹 서비스\n2. 카운터 앱(Kotlin): 농인 고객이 카페 직원과 수어로 대화할 수 있도록 지원하는 안드로이드 앱\n3. 관리자 웹(React): 카페 직원이 주문번호를 입력하면 주문 내역을 확인하고, 주문 상태를 관리할 수 있는 웹 서비스",
    roleAndContribution: [
      { text: "프론트엔드 전담 (프론트엔드 1, 백엔드 2, AI 1, 아바타 1)", level: 0 },
      { text: "농인 사용자 인터뷰를 통해 요구사항 도출 및 UI 흐름 개선", level: 1 },
      { text: "Counter App, Admin Web, Menu Web 총 3개 서비스의 디자인 및 프론트엔드 개발", level: 1 },
      { text: "MediaPipe 기반 동작 인식 데이터를 1차원 리스트로 변환하여 서버로 전달하는 데이터 처리 로직 구현", level: 1 },
      { text: "WebSocket과 gRPC 기반 양방향 통신 기능 구현", level: 1 },
    ],
    achievements: [
      {
        id: "sk-ai-summit-demo",
        title: "SK AI SUMMIT University Zone 시연",
        type: "presentation",
        date: "2025.11.03",
      },
      {
        id: "sw-centered-contest-award",
        title: "SW중심대학 디지털 경진대회 우수상",
        type: "award",
        date: "2025.08.12",
      },
      {
        id: "capstone-gold-award",
        title: "다학제간캡스톤디자인 졸업작품전시회 금상",
        type: "award",
        date: "2025.05.30",
      },
    ],
    troubleshooting: [
      {
        id: "mediapipe-client-offloading",
        title: "MediaPipe 처리 위치 전환으로 응답 속도 개선",
        summary:
          "대용량 프레임 서버 처리 병목을 클라이언트 1차 연산 구조로 바꿔 수어 인식 시간을 약 50% 단축했습니다.",
        tags: ["MediaPipe", "Performance", "Realtime", "Architecture"],
        content: `문제: 카메라 프레임을 서버에서 일괄 처리하는 구조로 인해 네트워크와 서버 부하가 커졌고, 수어 인식 응답이 불안정해 실시간 대화 경험을 해쳤습니다.
          추적: 전송 데이터 크기, 서버 처리 시간, 왕복 지연을 구간별로 분리해 측정하자 병목의 대부분이 프레임 업로드와 서버 전처리 구간에 집중되어 있음을 확인했습니다. 사용자 체감 지연은 네트워크 상황에 따라 크게 흔들렸습니다.
          원인: 고용량 원본 데이터를 서버에 지속 전달하는 구조가 실시간 상호작용 요구와 맞지 않았고, 서버 중앙 처리에 의존한 설계가 지연 변동성을 키웠습니다.
          해결: MediaPipe 1차 연산을 클라이언트에서 수행해 특징 벡터(일차원 리스트)만 서버로 전달하도록 파이프라인을 재설계했습니다. 서버는 경량 데이터 기반 후처리에 집중하도록 역할을 분리했습니다.
          결과: 수어 인식 시간이 약 50% 단축되어 반응성이 안정화됐고, 실시간 기능에서 처리 위치를 어떻게 나누는지가 품질에 직접 연결된다는 근거를 확보했습니다. 저사양 환경에서도 응답 품질 편차가 줄었습니다.`,
        isFeatured: true,
        order: 1,
        lesson:
          "실시간 비전 기능은 모델 성능만큼 데이터 이동 비용을 줄이는 아키텍처 설계가 중요했습니다.",
      },
      {
        id: "grpc-mediapipe-protobuf-build-stabilization",
        title: "gRPC + MediaPipe 도입 시 Protobuf 충돌 및 빌드 파이프라인 안정화",
        summary:
          "의존성 트리 분석으로 Protobuf 중복 충돌을 해결하고, Gradle Task 구조를 재정비해 빌드 파이프라인을 안정화했습니다.",
        tags: ["Android", "gRPC", "Protobuf", "Gradle", "Build Pipeline"],
        content: `문제: gRPC 통신과 MediaPipe를 함께 도입한 이후 Protobuf 관련 클래스 미해석 오류와 Duplicate class 에러가 동시에 발생해 빌드가 중단됐습니다. 단순 의존성 교체로는 해결되지 않았고, 충돌 해결 후에도 Gradle Task 단계에서 API 비호환 및 중복 등록 오류가 이어졌습니다.
          추적: 코드 문제가 아닌 빌드 구조 문제로 판단하고 Gradle dependency tree를 분석했습니다. 그 결과 gRPC 내부의 'protobuf-javalite', 프로젝트의 'protobuf-java', MediaPipe 라이브러리가 동일한 WKT 타입을 각각 포함하고 있어 클래스가 중복 로딩되고 있음을 확인했습니다. 이후 빌드 실패 원인을 Task 실행 그래프까지 확장해 추적했습니다.
          원인: 서로 다른 Protobuf 구현이 공존하면서 코드 생성 단계와 컴파일 단계에서 충돌이 누적됐고, 후처리 스크립트가 여러 번 실행되며 동일 Task가 중복 등록되는 구조적 문제가 있었습니다. 빌드 스크립트가 단일 책임으로 분리되지 않아 설정 변경 시 부작용이 쉽게 전파되는 상태였습니다.
          해결: 'protobuf-javalite'를 전역 exclude하고 'protobuf-java'로 통일했으며, Protobuf 생성 과정에서 자동 포함되는 WKT 파일을 제거해 중복 생성을 차단했습니다. 이후 WKT 제거 작업을 별도 Delete Task로 분리하고, Task 존재 여부를 확인한 뒤 조건부 등록하도록 재구성했습니다. 또한 '.proto'와 생성 클래스 패키징 제외 규칙을 명시해 산출물 단계의 중복까지 차단했습니다.
          결과: ProtoUtils/TimestampProto 오류 없이 빌드가 정상화됐고, gRPC와 MediaPipe를 동시에 유지할 수 있는 안정적인 의존성 기준을 확보했습니다. 이후 유사한 설정 변경에도 확장 가능한 빌드 구조를 유지하며 배포 파이프라인을 안정적으로 운영할 수 있게 됐습니다.`,
        isFeatured: true,
        order: 2,
      },
      {
        id: "accessibility-first-service-redesign",
        title: "농인 복지관 인터뷰를 기반으로 인터페이스 재설계",
        summary:
          "농인 사용자 대상 현장 인터뷰를 통해 텍스트 중심 설계의 한계를 확인하고 시각 중심 구조로 전환했습니다.",
        tags: ["Accessibility", "UX", "User Interview", "Product"],
        content: `문제: 초기 화면은 일반 사용자 기준으로 설계되어 텍스트 안내와 설명 문장이 많았고, 팀 내부에서는 큰 문제가 없다고 판단하고 있었습니다.
        추적: 실제 사용성을 확인하기 위해 농인 복지관을 방문해 인터뷰를 진행했습니다. 그 과정에서 '대부분의 농인들은 한국어를 읽지 못한다.'라는 피드백을 들었습니다.
        원인: 기능 구현 자체보다 정보 전달 방식이 문제였습니다. 농인 사용자에게 한국어는 제2언어에 가까울 수 있는데, 텍스트 이해를 전제로 화면을 설계하고 있었습니다.
        해결: 텍스트 비중을 줄이고 수어 아바타, 이모지, 단계별 시각 피드백 중심으로 화면 구조를 재설계했습니다. 핵심 행동은 짧은 문장과 명확한 아이콘, 상태 변화를 통해 직관적으로 인지할 수 있도록 수정했습니다.
        결과: 접근성은 배려 차원의 기능 보완이 아니라, 사용자의 소통 방식에 맞춰 제품 구조를 다시 정의하는 설계의 문제라는 점을 배웠습니다.`,
        isFeatured: true,
        order: 3,
      },
      {
        id: "react-strictmode-websocket-warning",
        title: "StrictMode 이중 실행으로 인한 WebSocket 경고 해소",
        summary:
          "개발 모드의 `useEffect` 이중 실행을 고려해 `useRef` 가드를 추가하고 불필요한 연결 종료/재연결을 막았습니다.",
        tags: ["React", "WebSocket", "StrictMode", "useEffect"],
        content: `문제: 웹 클라이언트에서 소켓 연결 직후 'WebSocket is closed before the connection is established' 경고가 반복됐고, 실시간 기능 검증 과정에서 신뢰도를 떨어뜨렸습니다.
          추적: 서버/네트워크 이상이 없는 상태에서 발생 시점이 마운트 직후라는 점에 집중해 React 렌더링 동작을 확인했습니다. React 18 개발 모드의 StrictMode에서 일부 'useEffect'가 의도적으로 두 번 실행되며 'cleanup -> 재실행'이 발생한다는 점을 재현했습니다.
          원인: 첫 연결 직후 cleanup이 실행되어 소켓이 닫히고, 곧바로 재연결이 시도되면서 경고가 반복되는 구조였습니다.
          해결: 소켓 인스턴스를 'useRef'로 관리하고, 이미 연결된 경우 재연결하지 않도록 가드 로직을 추가했습니다. 종료 시점도 명시적으로 분리해 중복 해제를 방지했습니다.
          결과: 연결 경고가 사라지고 실시간 기능 검증이 안정화됐으며, 개발 모드 동작 차이를 고려한 훅 설계 원칙을 코드에 반영했습니다.`,
        order: 4,
      },

    ],
    period: "2025.03 - 2025.10 (약 7개월)",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/nnyouung/signorder-frontend",
        type: "github",
      },
      {
        label: "소개 페이지",
        url: "https://kookmin-sw.github.io/capstone-2025-30/",
        type: "link",
      },
    ],
  },
  {
    id: "encore-collaboration",
    title: "Encore",
    overview:
      "대학생 IT 연합 동아리 '잇타'",
    tech: ["React Native", "TypeScript", "REST API"],
    image: "/images/encore-1.png",
    imageAlt: "Encore 앱 미리보기",
    images: [{ src: "/images/encore-1.png" }, { src: "/images/encore-2.png" }],
    description:
      "뮤지컬 팬들이 공연 정보를 쉽게 확인하고, 관람 후기를 남기며, 예매 인증을 통해 자신만의 티켓북을 만들 수 있는 모바일 커뮤니티 서비스입니다.\n공연 정보, 리뷰, 예매 인증 등 다양한 기능을 제공하여 사용자들이 자유롭게 소통하고 정보를 공유할 수 있습니다.",
    roleAndContribution: [
      { text: "프론트엔드 (기획 1, 디자이너 1, 프론트엔드 2, 백엔드 3)", level: 0 },
      { text: "프로젝트 핵심 아이디어 및 보조 기획 참여", level: 1 },
      { text: "배너 무한 캐러셀 구현", level: 1 },
      { text: "순환 배열 + 가짜 아이템으로 끊김 없는 무한 스크롤 UX 제공 -> 스크롤 이벤트 계산으로 정확한 인덱스 추적 및 자연스러운 화면 전환 구현", level: 2 },
      { text: "getItemLayout 적용 -> FlatList 가상화 성능 극대화 및 메모리 효율성 향상", level: 2 },
      { text: "ToolTip 컴포넌트 구현", level: 1 },
      { text: "onLayout 및 measureInWindow API를 활용해 화면상의 정확한 좌표 기반으로 ToolTip 위치 결정", level: 2 },
      { text: "사용자 행동(API 데이터)에 따라 표시 여부를 제어 -> 불필요한 안내 방지", level: 2 },
      { text: "AsyncStorage 활용하여 게시물 임시 저장 기능 구현 -> 앱 종료 후에도 데이터 유지", level: 1 },
    ],
    troubleshooting: [
      {
        id: "feature-priority-conflict-resolution",
        title: "포인트 기능 도입 갈등을 일정 기준으로 구조화",
        summary:
          "기획과 개발 간 우선순위 충돌을 기능 단위로 재정리하고 일정 영향도를 명확히 제시해 단계형 합의안을 도출했습니다.",
        tags: ["Collaboration", "Planning", "Leadership", "Product Thinking"],
        content: `문제: 4개월 내 완성이 목표였던 뮤지컬 커뮤니티 앱에서 포인트 기능 도입 여부를 두고 팀 내 의견이 크게 갈렸습니다. 기획 측은 서비스 차별화를 위해 반드시 필요하다고 보았고, 개발 측은 일정 지연과 품질 저하를 우려했습니다. 사용자 경험과 개발 안정성이라는 서로 다른 우선순위가 부딪히며 논의가 반복됐습니다.
          추적: 단순 찬반이 아니라 판단 기준이 다르다는 점에 주목했습니다. 기능을 '게시물', '리뷰', '포인트 적립'처럼 구현 단위로 나누고, 각 기능의 기술 난이도를 상/중/하로 구분했습니다. 또한 예상 소요 시간을 Man-Day 기준으로 정리해, 개발자가 아니더라도 일정 부담을 직관적으로 이해할 수 있도록 자료를 구성했습니다.
          원인: '필요하다' 또는 '어렵다'라는 주장만 존재했고, 기능이 전체 일정과 완성도에 어떤 영향을 주는지 한눈에 볼 수 있는 기준이 없었습니다.
          해결: 기능별 구현 단위와 예상 소요를 공유한 뒤, 핵심 사용자 흐름에 직접 연결되는 범위만 우선 구현하고 부가 기능은 후순위로 미루는 단계형 계획을 제안했습니다. 이를 통해 논의의 초점을 ‘도입 여부’에서 ‘구현 범위와 순서’로 전환했습니다.
          결과: 포인트 기능은 유지하되 일부 세부 기능의 우선순위를 조정하는 방향으로 합의했고, 프로젝트를 일정 내 완성해 발표까지 마칠 수 있었습니다. 이후 팀 내 기능 논의에서도 동일한 기준을 활용하며 의사결정 속도가 개선되었습니다.`,
        isFeatured: true,
        order: 1
      }
    ],
    period: "2024.09 - 2025.01 (약 5개월)",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/nnyouung/encore-frontend",
        type: "github",
      },
    ],
  },
  {
    id: "timepay-improvement",
    title: "TimePay (서비스 개선 프로젝트)",
    overview:
      "국민대학교",
    tech: ["TypeScript"],
    image: "/images/dife.png",
    imageAlt: "TimePay 서비스 개선",
    images: [{ src: "/" }, { src: "/" }],
    description:
      "시간으로 품앗이를 진행하는 고령층 대상 앱 개선 프로젝트입니다.",
    roleAndContribution: [
      { text: "프론트엔드 참여 (기획 2, 프론트엔드 3) (기존 프로젝트 개선)", level: 0 },
      { text: "행동 관찰/인터뷰를 통한 사용자 조사 진행", level: 1 },
      { text: "로그인 버튼 문구와 플로우를 직관적으로 재설계", level: 1 },
    ],
    troubleshooting: [
      {
        id: "login-flow-redesign-and-alignment",
        title: "로그인 이탈 증가를 인증 플로우 재설계로 개선",
        summary:
          "소셜 로그인 도입 후 급증한 이탈 문제를 사용자 조사와 팀 협업을 통해 재정의하고, 인증 흐름 단순화로 전환율을 회복했습니다.",
        tags: ["Authentication", "UX", "Cross Functional", "Onboarding"],
        content: `문제: 편의성을 높이기 위해 카카오 소셜 로그인을 도입했지만 로그인 단계 이탈률이 40% 이상으로 급증했습니다. 기획 의도와 달리 첫 진입 단계에서 사용자가 멈추는 현상이 반복됐고, 이후 기능 개선 효과도 전달되지 못하는 상황이었습니다.
          추적: 코드 오류보다 사용자 행동 맥락에 원인이 있다고 보고, 행정학과 팀원과 함께 고령층 사용자 9명을 대상으로 관찰 및 인터뷰를 진행했습니다. 로그인 시 멈추는 지점, 화면 전환 반응, 문구 이해도를 기록하며 실제 사용 흐름을 재구성했습니다.
          원인: 계정 정보를 기억하지 못해서가 아니라, 낯선 인증 화면에서 시도 자체를 중단하는 심리적 장벽이 핵심이었습니다. 또한 화면 문구가 서비스 설명에 치우쳐 다음 행동을 직관적으로 유도하지 못하고 있었습니다.
          해결: 소셜 로그인을 제거하고 전화번호 기반 인증으로 전환해 진입 절차를 단순화했습니다. 버튼과 안내 문구를 ‘지금 해야 할 행동’ 중심으로 재작성하고, 단계 수를 줄이며 이전 단계 복귀 경로를 명확히 설계했습니다. 팀 내에서는 “편의 기능 추가”보다 “이해 가능한 흐름 확보”를 우선 기준으로 합의했습니다.
          결과: 로그인 이탈률을 10% 미만으로 낮추며 진입 성공률을 회복했습니다. 이후 기능 논의에서도 사용자 이해 가능성을 우선 검증하는 협업 방식이 정착됐습니다.`,
        isFeatured: true,
        order: 1
      }
    ],
    period: "2022.09 - 2022.12 (약 3개월)",
  },
];
