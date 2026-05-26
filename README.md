# 온(溫) 커넥트 / On Connect

가족 간 대화의 타이밍, 말투, 주제, 행동을 추천하는 **AI Family Relationship Agent** MVP입니다.

## 문제 정의

현대 가족 관계에서는 물리적으로 떨어져 지내는 시간이 길어지면서 부모와 자녀가 서로를 챙기고 싶어도 적절한 타이밍과 표현을 놓치는 경우가 많습니다. 자녀는 부모님의 상태를 매번 확인하기 어렵고, 부모님은 자녀에게 부담을 주지 않으려 안부를 망설이기도 합니다.

온(溫) 커넥트는 단순한 안부 알림 앱이 아니라, 가족 간 관계를 따뜻하게 유지하기 위한 대화 타이밍, 말투, 주제, 케어 행동을 제안하는 관계 보조 서비스입니다. 특히 부모님이 동의한 정서/생활 신호만 공유한다는 원칙을 기반으로, 감시가 아닌 상호 동의 기반의 가족 케어 경험을 지향합니다.

## 핵심 사용자

- **자녀**: 부모님의 안부 흐름, 관계 온도, 케어 리포트, 추천 행동을 확인하고 자연스럽게 연락할 수 있는 사용자
- **부모님**: 큰 글씨와 단순한 버튼으로 자녀에게 안부를 보내고, 공유할 정보를 직접 선택할 수 있는 사용자

## 핵심 기능

- **역할별 온보딩**: 자녀와 부모님을 구분해 서로 다른 시작 흐름 제공
- **관계 온도 홈**: 가족 간 연결 상태를 온도와 최근 시그널로 시각화
- **안부 시그널 추천**: 시간대, 날씨, 최근 대화 태그, 연락 공백을 기반으로 안부 문장 추천
- **Warm Reply AI**: 부모님의 메시지에서 가능한 정서 신호를 분석하고 답장 전략/문구 제안
- **Parent Briefing**: 연락 전 알아두면 좋은 최근 흐름, 관계 온도, 추천 대화 시작문 제공
- **케어 리포트**: 안부, 건강 메모, 생활 리듬 등 동의 기반 신호를 요약
- **케어 액션/선물 추천**: 선물 구매보다 관계 회복과 케어 행동 중심의 추천 제공
- **부모님 대화 보조**: 부모님 화면에서 안부 추천, 빠른 답장, 대화 전 브리핑, 관계 리포트 제공

## AI 구현

현재 AI 기능은 발표/시연용으로 안정적으로 동작하도록 **규칙 기반 mock AI 파이프라인**을 기본값으로 사용합니다. 일부 감정 맥락 분석은 환경변수를 켜면 Anthropic Claude API를 호출하고, 실패 시 mock 분석으로 fallback합니다.

### AI API 라우트

- `POST /api/ai/briefing`: 부모 프로필, 동의 설정, 관계 온도, 케어 시그널을 바탕으로 Parent Briefing 생성
- `POST /api/ai/warm-reply`: 부모님 메시지를 분석해 가능한 정서 신호, 답장 전략, 추천 답장 생성
- `POST /api/ai/care-action`: 케어 시그널과 최근 대화 메모 기반으로 오늘 실행할 케어 액션 추천
- `POST /api/ai/report`: 관계 온도, 연락 패턴, 케어 시그널, 선물 후보를 요약한 리포트 생성
- `POST /api/ai/emotion-analyze`: 메시지의 표면 의미, 가능한 정서 신호, 맥락 요인, 주의 문구, 추천 전략 분석
- `POST /api/ai/topic-greeting`: 선택한 주제, 부모 프로필, 날씨, 시간대를 반영한 안부 문장 생성
- `POST /api/ai/checkin-suggestions`: 날씨, 시간대, 최근 연락 기록, 관심사 기반 안부 추천 3개 생성
- `POST /api/ai/reply-suggestions`: 받은 메시지와 발신자 이름 기반 빠른 답장 후보 생성

### AI 파이프라인 구조

- `lib/ai/pipeline.ts`: `briefing`, `warm-reply`, `care-action`, `report` 공통 요청 정규화 및 응답 생성
- `lib/ai/prompts.ts`: 작업별 prompt template 정의 및 부모 프로필/관계 온도 컨텍스트 구성
- `lib/ai/mockAiResponses.ts`: 작업별 결정론적 mock AI 응답 생성
- `lib/ai/emotionAnalyzer.ts`: 메시지 키워드, 연락 리듬, 평소 메시지 길이, 최근 기분 흐름을 조합한 정서 맥락 분석
- `lib/ai/checkInGenerator.ts`: 날씨, 식사 시간, 최근 대화 주제, 관심사 기반 안부 추천 생성
- `lib/emotion/emotionTaxonomy.ts`: 정서 taxonomy와 화면 표시 스타일 정의

### 실제 LLM 연동 옵션

감정 맥락 분석은 아래 환경변수를 설정하면 `/api/ai/emotion-analyze`에서 Claude API를 호출합니다.

```bash
USE_REAL_AI=true
ANTHROPIC_API_KEY=your_api_key
```

real 모드에서도 LLM 결과는 mock 분석 결과와 병합됩니다. `suggestedReplies`와 내부 보조 지표는 서버의 mock 로직으로 보완하며, API 호출 실패 또는 키 누락 시 mock 분석으로 fallback합니다.

## 구현된 라우트

### 시작 및 역할 선택

- `/`
- `/home`
- `/onboarding`
- `/onboarding/welcome`
- `/onboarding/role`

### 자녀 온보딩

- `/onboarding/child`
- `/onboarding/child/profile`
- `/onboarding/child/invite`
- `/onboarding/child/reminder`
- `/onboarding/child/complete`

### 부모님 온보딩

- `/onboarding/parent`
- `/onboarding/parent/welcome`
- `/onboarding/parent/profile`
- `/onboarding/parent/signal-time`
- `/onboarding/parent/complete`

### 자녀 앱 화면

- `/child/home`
- `/child/signal`
- `/child/signal/recommend`
- `/child/signal/recommend/[id]`
- `/child/signal/recommend/[id]/reply`
- `/child/care`
- `/child/care/summary`
- `/child/care/action/[id]`
- `/child/care/action/[id]/gift`
- `/child/gift`
- `/child/report`

### 부모님 앱 화면

- `/parent/home`
- `/parent/greeting`
- `/parent/reply`
- `/parent/briefing`
- `/parent/report`
- `/parent/settings/consent`

### 디자인 레퍼런스

- `/design/app-concept`
- `/design/onboarding-flow`

## 기술 스택

- **Framework**: Next.js App Router
- **Language**: TypeScript
- **UI**: React, Tailwind CSS, inline style 기반 레퍼런스 변환
- **Icons**: lucide-react
- **State**: React local state, localStorage
- **Data**: `lib/mockData.ts`, `lib/demoDataset.ts` 기반 demo/mock data
- **AI**: Next.js Route Handler 기반 mock AI pipeline, 선택적 Anthropic Claude 연동

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 다음 주소로 접속합니다.

```bash
http://localhost:3000
```

프로덕션 빌드 확인:

```bash
npm run build
```

## 현재 구현 범위

현재 버전은 발표 및 사용자 흐름 검증을 위한 **mock data 기반 MVP**입니다. 데이터베이스, 인증, 실제 메시지/알림 전송, 실제 권한 연동은 아직 연결되어 있지 않습니다.

AI 관련 기능은 앱 내부 API 라우트로 구현되어 있으며, 기본적으로 mock data와 규칙 기반 분석을 사용합니다. 감정 맥락 분석은 `USE_REAL_AI=true`와 `ANTHROPIC_API_KEY`가 설정된 경우 Claude API를 호출할 수 있습니다.

구현된 동작은 다음과 같습니다.

- 역할 선택 시 `localStorage`에 `child` 또는 `parent` 저장
- `/` 또는 `/home` 진입 시 저장된 역할에 따라 자녀 홈 또는 부모 홈으로 이동
- 부모 홈에서 안부 버튼 클릭 시 전송 상태 메시지 표시
- 자녀 안부 화면에서 빠른 답장 선택 시 최근 답장 반영
- 자녀 홈의 Parent Briefing 카드에서 `/api/ai/briefing` 호출 및 fallback briefing 표시
- Warm Reply 화면에서 부모님 메시지의 가능한 정서 신호와 답장 추천 표시
- 안부 추천 API에서 날씨, 시간대, 최근 연락 기록, 관심사 기반 추천 생성
- 케어 액션/리포트 API에서 관계 온도, 케어 시그널, 최근 대화 메모를 근거로 추천 생성
- 선물/케어 추천 화면에서 추천 카드 클릭 시 추천 이유 모달 표시
- 부모님이 동의한 정보만 공유한다는 안내 및 공유 정보 선택 UI 제공

## 향후 계획

- 실제 AI API 연동 범위를 briefing, care-action, report까지 확장
- AI 응답 schema validation 및 prompt versioning 고도화
- DB 연동을 통한 가족 구성원, 안부 기록, 동의 설정 저장
- 가족 초대 링크 및 초대 수락 플로우 구현
- 동의 기반 데이터 공유 정책과 권한 관리 기능 확장
- 부모님용 큰 글씨 모드와 접근성 옵션 고도화
- 실제 알림, 메시지 전송, 케어 리포트 자동 생성 기능 연동
