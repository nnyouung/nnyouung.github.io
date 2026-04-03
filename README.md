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

**1) RAG 파이프라인**
- OpenAI 임베딩(text-embedding-3-small) 기반 벡터 유사도 검색
- Qdrant 벡터 DB 영구 저장 — cold start 시 재임베딩 없이 즉시 서비스
- 포트폴리오 JSON + Velog RSS 이중 문서 소스
- 한국어 질의 최적화 태그 + 수상이력 통합 요약 문서
- 근거 제한 프롬프트 + 출처 강제 표기 (10개 규칙)

**2) Worker 경계 레이어**
- Origin 검증
- Cloud Run 인증 토큰 전달
- 오류 응답 정규화

**3) Cloud Run 백엔드 (Spring Boot)**
- 질문·답변 로그 기록 및 Slack Webhook 알림 연동
- PII 마스킹 (이메일·전화번호·주민번호·URL 치환 후 로깅)
- OpenAI 오류 매핑 및 응답 완결성 보정

## 🏗 Architecture Overview
```
Next.js (Static Export / GitHub Pages)
  ↓
Cloudflare Worker  ← Origin 검증 / 인증 토큰 / 오류 정규화
  ↓
Cloud Run (Spring Boot)  ← RAG 처리 / Slack 알림
  ↓  ↓
Qdrant (벡터 DB)   OpenAI API (GPT-4o-mini / text-embedding-3-small)
```

```
nnyouung.github.io/
├─ app/                      # Next.js App Router (정적 export)
│  ├─ ai/                    # AI Assistant 페이지
│  └─ portfolio/             # 포트폴리오 목록/상세 페이지
├─ components/               # UI 컴포넌트
├─ data/                     # 정적 데이터 및 knowledge 빌더
│  ├─ projects.ts
│  ├─ experience.ts
│  ├─ skills.ts
│  └─ aiKnowledge.ts         # 문서 생성 / 수상 요약 집계
├─ scripts/                  # 빌드 시 knowledge JSON 생성
│  └─ generate-knowledge.ts
├─ workers/ai-proxy/         # Cloudflare Worker (CORS / 프록시)
├─ cloud-run/spring-rag/     # Spring Boot RAG 서버
│  └─ src/main/java/…
│     ├─ repository/DocumentVectorStore.java   # Qdrant 연동
│     ├─ service/RagService.java               # 검색 + 프롬프트
│     ├─ service/PortfolioDataLoader.java      # 문서 인덱싱
│     └─ service/SlackNotificationService.java # 알림 + PII 마스킹
├─ public/                   # 정적 이미지 / portfolio-knowledge.json
└─ .github/workflows/        # GitHub Pages 배포 워크플로우
```

## 🛠 Tech Stack
### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Static Export

### Backend / AI
- Java 17 / Spring Boot 3
- Spring AI (OpenAI 연동)
- GPT-4o-mini + text-embedding-3-small
- Qdrant 벡터 DB 기반 RAG

### Infra
- GitHub Pages
- Cloudflare Workers
- Google Cloud Run
- Qdrant Cloud

## ⚙️ 환경변수

### Cloud Run
| 변수 | 설명 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `BACKEND_AUTH_TOKEN` | Worker → Cloud Run 인증 토큰 |
| `QDRANT_HOST` | Qdrant 호스트 |
| `QDRANT_API_KEY` | Qdrant API 키 |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL |
| `FORCE_REINDEX` | `true` 시 Qdrant 재인덱싱 (기본값 `false`) |
