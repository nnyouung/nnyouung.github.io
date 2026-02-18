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
          결과: CI 실패를 단기 우회가 아닌 근본 수정으로 마무리했고, 이후 유사 이슈에서 병합 이력과 로그를 함께 보는 분석 기준을 팀에 공유했습니다. 병합 후 검증 순서를 체크리스트로 남겨 재현 시간도 줄였습니다.`,
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
        order: 2,
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
        order: 3,
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
        order: 4,
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
        order: 5,
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
        order: 6,
        lesson:
          "다국어 품질은 번역량보다 초기화 순서와 단일 데이터 원천 정의가 더 큰 영향을 준다는 점을 배웠습니다.",
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
        id: "accessibility-first-service-redesign",
        title: "수어 사용자 관점으로 인터페이스 재정의",
        summary:
          "농인 사용자에게 한국어가 제2외국어가 될 수 있다는 점을 반영해 텍스트 중심 흐름을 시각 중심으로 재설계했습니다.",
        tags: ["Accessibility", "UX", "Product", "Sign Language"],
        content: `문제: 초기 화면 설계가 일반 텍스트 안내에 의존해 수어 사용자에게 정보 접근 장벽이 생겼고, 핵심 기능 이해까지 시간이 오래 걸렸습니다.
          추적: 사용자 맥락을 다시 점검하며 인터페이스 요소별 인지 부담을 분석한 결과, 문장 기반 안내가 반복될수록 기능 파악 속도가 크게 떨어지는 패턴이 확인됐습니다. 특히 주문/문의 같은 즉시 반응 상황에서 텍스트 중심 흐름은 사용성 저하를 더 크게 만들었습니다.
          원인: 기능 구현 자체는 가능했지만, 정보 전달 매체가 대상 사용자의 주된 소통 방식과 맞지 않아 제품 목표와 인터페이스 전략이 분리되어 있었습니다.
          해결: 텍스트 비중을 줄이고 수어 아바타, 이모지, 단계별 시각 피드백 중심으로 화면 구조를 재정의했습니다. 핵심 액션은 짧은 시각 단서와 명확한 상태 표시로 재구성해 해석 부담을 낮췄습니다.
          결과: 기능 이해 시간이 줄고 흐름 이탈이 감소했으며, 기술 선택이 사용자 소통 방식과 연결되어야 한다는 제품 기준을 팀 내에 정착시켰습니다. 초기 사용 학습 부담도 함께 낮출 수 있었습니다.`,
        order: 1,
      },
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
        order: 2,
        lesson:
          "실시간 비전 기능은 모델 성능만큼 데이터 이동 비용을 줄이는 아키텍처 설계가 중요했습니다.",
      },
      {
        id: "grpc-mediapipe-protobuf-duplicate-class",
        title: "gRPC + MediaPipe 도입 시 Protobuf 충돌 해결",
        summary:
          "의존성 트리 분석으로 WKT 중복 포함 지점을 찾아 `protobuf-javalite` 제외 및 생성물 정리로 빌드를 복구했습니다.",
        tags: ["Android", "gRPC", "Protobuf", "Gradle"],
        content: `문제: gRPC 통신과 MediaPipe를 함께 적용한 뒤 Protobuf 관련 클래스 미해석과 Duplicate class 에러가 동시에 발생해 빌드가 중단됐습니다.
          추적: 단순 코드 오류가 아니라 의존성 충돌 가능성에 집중해 Gradle dependency tree를 분석했습니다. 그 결과 gRPC 내부 'protobuf-javalite', 프로젝트의 'protobuf-java', MediaPipe 라이브러리가 동일한 WKT 타입을 각각 포함하고 있음을 확인했습니다.
          원인: 서로 다른 버전/패키징 전략의 Protobuf 구현이 공존하면서 동일 클래스가 중복 로딩됐고, 코드 생성 단계와 컴파일 단계에서 충돌이 누적됐습니다.
          해결: 'protobuf-javalite'를 전역 exclude하고 'protobuf-java'를 강제 사용하도록 정리했습니다. 추가로 Protobuf 생성 과정에서 자동 포함되는 WKT 파일을 제거해 중복 생성을 차단했습니다.
          결과: ProtoUtils/TimestampProto 오류 없이 빌드가 정상화됐고, gRPC와 MediaPipe를 동시에 유지하는 안정적인 의존성 기준을 확보했습니다.`,
        isFeatured: true,
        order: 3,
      },
      {
        id: "gradle-task-stabilization-after-protobuf-fix",
        title: "Gradle Task 중복 등록 및 API 비호환 안정화",
        summary:
          "WKT 제거 후 발생한 Task 충돌을 분리 Task와 조건부 등록으로 재구성해 빌드 파이프라인을 안정화했습니다.",
        tags: ["Gradle", "Build Pipeline", "Android", "Automation"],
        content: `문제: Protobuf 중복 이슈를 정리한 이후에도 Gradle Task 실행 단계에서 API 비호환 오류와 동일 이름 Task 중복 등록 오류가 이어져 빌드가 다시 실패했습니다.
          추적: 에러 라인만 수정하는 대신 Task 생성 순서와 실행 그래프를 검토한 결과, 존재하지 않는 API('removeAll') 호출과 중복 Task 등록 로직이 동시에 문제를 만들고 있었습니다. 특히 후처리 스크립트가 여러 단계에 걸쳐 재실행되며 충돌을 키웠습니다.
          원인: 빌드 스크립트가 단일 책임으로 분리되지 않아 설정 변경 시 부작용이 쉽게 전파되는 구조였습니다.
          해결: WKT 제거 작업을 별도 Delete Task로 분리하고, Task 존재 여부를 검사한 뒤 조건부로 등록하도록 재구성했습니다. 추가로 '.proto'와 생성 클래스 패키징 제외 규칙을 명시해 산출물 단계의 중복까지 차단했습니다.
          결과: 빌드 스크립트가 안정화되어 유사한 설정 변경에도 확장 가능한 구조를 확보했고, 반복 실패 없이 배포 파이프라인을 운영할 수 있게 됐습니다.`,
        isFeatured: true,
        order: 4,
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
        order: 5,
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
      { text: "getItemLayout 적용 → FlatList 가상화 성능 극대화 및 메모리 효율성 향상", level: 2 },
      { text: "ToolTip 컴포넌트 구현", level: 1 },
      { text: "onLayout 및 measureInWindow API를 활용해 화면상의 정확한 좌표 기반으로 ToolTip 위치 결정", level: 2 },
      { text: "사용자 행동(API 데이터)에 따라 표시 여부를 제어 -> 불필요한 안내 방지", level: 2 },
      { text: "AsyncStorage 활용하여 게시물 임시 저장 기능 구현 -> 앱 종료 후에도 데이터 유지", level: 1 },
    ],
    troubleshooting: [
      {
        id: "feature-priority-conflict-resolution",
        title: "포인트 기능 도입 갈등을 데이터 기반으로 조정",
        summary:
          "기획/개발 간 우선순위 충돌을 기능별 난이도와 소요 시간 지표로 정리해 합의 가능한 결정 구조를 만들었습니다.",
        tags: ["Collaboration", "Planning", "Estimation", "Leadership"],
        content: `문제: 서비스 차별화를 위해 포인트 기능을 추가하려는 기획 측 요구와, 구현 난이도 및 일정 부담을 우려한 개발 측 의견이 충돌해 논의가 반복되고 의사결정이 지연됐습니다.
          추적: 감정적 찬반이 아니라 판단 기준 부재가 핵심이라고 보고, 기능별 기술 난이도, 의존 관계, 예상 소요 시간을 정리해 비교 가능한 지표를 만들었습니다. 이후 팀 회의에서 각 기능이 일정과 품질에 미치는 영향을 동일 기준으로 검토했습니다.
          원인: "필요하다/어렵다" 수준의 정성 주장만 있었고, 일정 리스크를 수치로 공유하는 프레임이 없어 합의 비용이 커졌습니다.
          해결: 포인트 기능을 완전 제외하지 않고 핵심 가치가 높은 범위만 남긴 축소안을 제안했습니다. 동시에 저우선 기능의 범위를 줄여 발표 가능한 제품 완성도를 확보하도록 로드맵을 재배치했습니다.
          결과: 팀 공감대를 기반으로 결정이 마무리됐고, 시연 가능한 앱을 일정 내 완성해 발표까지 이어갈 수 있었습니다. 근거 중심 논의로 회의 반복 횟수도 줄일 수 있었습니다.`,
        isFeatured: true,
        order: 1,
      },
      {
        id: "scope-trim-with-core-feature-plan",
        title: "핵심 기능안으로 범위 재설계",
        summary:
          "기능 추가와 일정 안정성을 동시에 충족하기 위해 핵심 기능안 중심으로 범위를 재구성했습니다.",
        tags: ["Scope Management", "Product", "Teamwork"],
        content: `문제: 기능 요구는 계속 늘어나는데 개발 인력과 시간은 제한되어 있어, 모든 요구를 유지하면 일정 지연과 품질 저하가 동시에 발생할 가능성이 높았습니다.
          추적: 필수 사용자 가치와 발표 목적을 기준으로 기능을 재분류하고, 구현 복잡도 대비 효과가 낮은 세부 항목을 우선적으로 후보군에서 제외했습니다. 또한 핵심 플로우를 기준으로 의존성이 높은 작업부터 역산해 일정 시뮬레이션을 반복했습니다.
          원인: 초기 계획이 기능 목록 중심으로 작성되어 있었고, 사용자 가치와 일정 제약을 함께 반영한 우선순위 모델이 부족했습니다.
          해결: 포인트 기능은 유지하되 세부 규칙과 부가 UI를 축소한 핵심 기능안으로 전환했고, 필수 플로우 완성 이후 확장 항목을 다루는 단계형 계획으로 합의했습니다.
          결과: 범위와 일정의 균형을 확보해 팀이 같은 목표를 공유할 수 있었고, 최종적으로 데모 완성도와 납기 모두를 지킬 수 있었습니다. 우선순위 기준이 명확해져 리스크 커뮤니케이션도 쉬워졌고, 이후 작업 분배도 안정적으로 진행됐습니다.`,
        isFeatured: true,
        order: 2,
      },
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
  // {
  //   id: "timepay-improvement",
  //   title: "TimePay (서비스 개선 프로젝트)",
  //   overview:
  //     "국민대학교",
  //   tech: ["TypeScript"],
  //   image: "/images/dife.png",
  //   imageAlt: "TimePay 서비스 개선",
  //   images: [{ src: "/" }, { src: "/" }],
  //   description:
  //     "시간으로 품앗이를 진행하는 고령층 대상 앱 개선 프로젝트입니다.",
  //   roleAndContribution: [
  //     { text: "프론트엔드 참여 (기획 2, 프론트엔드 3) (기존 프로젝트 개선)", level: 0 },
  //     { text: "행동 관찰/인터뷰를 통한 사용자 조사 진행", level: 1 },
  //     { text: "로그인 버튼 문구와 플로우를 직관적으로 재설계", level: 1 },
  //   ],
  //   troubleshooting: [
  //     {
  //       id: "social-login-dropoff-investigation",
  //       title: "소셜 로그인 도입 후 이탈 증가 원인 분석",
  //       summary:
  //         "기술 오류보다 사용자 행동 장벽을 가설로 세우고 조사 설계를 통해 로그인 이탈 급증 원인을 재정의했습니다.",
  //       tags: ["UX Research", "Authentication", "Data Analysis", "Accessibility"],
  //       content: `문제: 편의성을 높이기 위해 카카오 소셜 로그인을 도입했지만 로그인 단계 이탈률이 40% 이상으로 급증해 핵심 진입 경로가 막혔습니다.
  //         추적: 코드 결함보다 사용 행태 이슈 가능성을 우선 검토하고, 행정학과 팀원과 함께 고령층 사용자 9명을 대상으로 행동 관찰과 인터뷰를 진행했습니다. 로그인 시점에서 멈추는 순간, 화면 전환 반응, 문구 이해도를 정성/정량으로 함께 기록했습니다.
  //         원인: 계정 정보를 기억하지 못해서가 아니라, 낯선 화면을 마주할 때 시도 자체를 중단하는 심리적 장벽이 반복적으로 발생하는 것이 핵심이었습니다.
  //         해결: 소셜 로그인을 제거하고 전화번호 기반 인증으로 전환했으며, 버튼 문구와 화면 흐름을 익숙한 단계 중심으로 단순화했습니다. 설명 텍스트도 행동 유도형으로 정리했습니다.
  //         결과: 로그인 이탈률을 10% 미만으로 낮추며 진입 성공률을 회복했고, 기능 편의성보다 사용자 이해 가능성이 우선이라는 기준을 팀 내에 확립했습니다. 온보딩 만족도 관련 정성 피드백도 개선됐습니다.`,
  //       isFeatured: true,
  //       order: 1,
  //       lesson:
  //         "기술적으로 좋은 선택이 사용자에게는 오히려 진입 장벽이 될 수 있다는 점을 데이터로 확인했습니다.",
  //     },
  //     {
  //       id: "cross-discipline-research-framing",
  //       title: "타 전공 협업으로 사용자 문제 정의 정교화",
  //       summary:
  //         "행정학과 팀원과의 공동 리서치로 디지털 경험 특성을 구조화해 개선 우선순위를 명확히 했습니다.",
  //       tags: ["Cross Functional", "User Research", "Problem Framing"],
  //       content: `문제: 개선 논의가 개발자 관점의 사용성 판단에 머물러 실제 고령층 사용자 문제를 정확히 정의하기 어려웠고, 기능 개선 우선순위가 자주 바뀌었습니다.
  //         추적: 타 전공 팀원이 보유한 사용자 조사 관점을 적극 반영해 인터뷰 질문과 관찰 기준을 재설계했습니다. 저는 앱 사용 흐름과 전환 지점을 분석하고, 팀원은 디지털 경험 특성과 심리적 저항 신호를 구조화해 서로의 데이터를 교차 검증했습니다.
  //         원인: 초기에는 기술적 편의성과 실제 사용자 인지 특성을 동일한 것으로 가정해, 문제 원인을 인터페이스 복잡도보다 기능 유무로만 해석한 한계가 있었습니다.
  //         해결: 조사 결과를 바탕으로 "낯섦 최소화"를 최우선 목표로 정의하고, 인증 방식/문구/화면 순서를 모두 그 목표에 맞춰 재정렬했습니다. 기능 추가보다 이해 가능한 흐름 확보를 먼저 수행했습니다.
  //         결과: 개선안의 방향이 명확해져 팀 합의 속도가 높아졌고, 사용자 중심 검증을 먼저 수행하는 협업 습관을 프로젝트 프로세스로 정착시킬 수 있었습니다.`,
  //       isFeatured: true,
  //       order: 2,
  //     },
  //     {
  //       id: "phone-auth-flow-redesign",
  //       title: "전화번호 인증 중심 로그인 플로우 재설계",
  //       summary:
  //         "조사 결과를 반영해 인증 방식과 화면 문구를 단순화하고 로그인 성공률을 안정적으로 높였습니다.",
  //       tags: ["UX", "Onboarding", "Flow Design", "TypeScript"],
  //       content: `문제: 로그인 단계에서 반복 이탈이 발생해 이후 기능 개선 효과가 사용자에게 전달되지 않았고, 첫 사용 경험 자체가 중단되는 상황이 이어졌습니다.
  //         추적: 이탈 로그와 사용자 관찰 기록을 결합해 실패 지점을 분석한 결과, 계정 연동 이해가 필요한 화면에서 중단 비율이 가장 높았습니다. 특히 한 번 실패한 사용자는 재시도율도 낮아 후속 전환에 치명적이었습니다.
  //         원인: 인증 방식이 사용자의 기존 습관과 맞지 않았고, 화면 문구가 행동 지시보다 서비스 설명에 치우쳐 다음 행동을 직관적으로 유도하지 못했습니다.
  //         해결: 전화번호 기반 인증으로 진입 절차를 단순화하고, 버튼/도움말 문구를 "지금 해야 할 행동" 중심으로 재작성했습니다. 단계 수를 줄이고 이전 단계 복귀 경로를 명확히 해 실패 부담을 낮췄습니다.
  //         결과: 로그인 이탈률이 10% 미만으로 안정화됐고, 초기 진입 경험 개선이 서비스 전체 이용률에 미치는 영향을 팀이 명확히 확인할 수 있었습니다. 실패 후 재시도율 개선도 함께 확인했습니다.`,
  //       isFeatured: true,
  //       order: 3,
  //     },
  //   ],
  //   period: "2022.09 - 2022.12 (약 3개월)",
  // },
];
