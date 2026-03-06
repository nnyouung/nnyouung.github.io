# Portfolio With AI Chatbot
문제 해결 사례를 구조적으로 정리하고, 질의응답 형태로 빠르게 탐색할 수 있게 설계한 [개인 포트폴리오 웹사이트](https://nnyouung.github.io)입니다.

## 👩‍💻 About This Repository
이 레포지토리는 제 경험과 강점, 기술 스택을 소개하는 포트폴리오로, 주요 구성은 다음과 같습니다.
- 프로젝트 경험 정리
  - 상세 페이지 동적 세그먼트([id]) 기반 정적 페이지 생성
  - 트러블슈팅 모달 구성
- 소개 및 강점
- 기술 스택 및 성장 포인트
- AI 질의응답 인터페이스

## 🤖 AI Assistant
AI는 포트폴리오를 더 잘 전달하기 위한 인터페이스입니다.<br>
긴 문서를 읽지 않아도 질문을 통해 핵심을 빠르게 파악할 수 있도록 만들고 싶었습니다.

**1) RAG-lite**
- 정적 문서 기반 점수화 검색
- 근거 제한 프롬프트
- 출처 강제 표기

**2) Worker 경계 레이어**
- Origin 검증
- Cloud Run 인증 토큰 전달
- 오류 응답 정규화

**3) Cloud Run 정책 레이어**
- 쿼터 관리
- Gemini 오류 매핑
- 응답 완결성 보정(continuation/재작성)

## 🏗 Architecture Overview
```
Next.js (Static Export / GitHub Pages)
  ↓
Cloudflare Worker
  ↓
Cloud Run
  ↓
Gemini API
```

```
nnyouung.github.io/
├─ app/                      # Next.js App Router (정적 export)
│  ├─ ai/                    # AI Assistant 페이지
│  └─ portfolio/             # 포트폴리오 목록/상세 페이지
├─ components/               # UI 컴포넌트
├─ data/                     # 정적 데이터 및 RAG-lite 로직
│  ├─ projects.ts
│  ├─ experience.ts
│  ├─ skills.ts
│  └─ aiKnowledge.ts         # 문서 생성/검색/프롬프트 빌더
├─ workers/ai-proxy/         # Cloudflare Worker (CORS/프록시)
├─ cloud-run/ai-backend/     # Gemini 호출 서버 (쿼터/오류 매핑)
├─ public/                   # 정적 이미지 리소스
└─ .github/workflows/        # GitHub Pages 배포 워크플로우
```

## 🛠 Tech Stack
### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind
- Static Export

### Backend / AI
- Node 22 (Cloud Run)
- Gemini 2.5 Flash
- 정적 문서 기반 RAG-lite

### Infra
- GitHub Pages
- Cloudflare Workers
- Google Cloud Run
