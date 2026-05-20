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
- **안부 시그널**: 시간, 날씨, 대화 맥락에 맞는 안부 문장 추천
- **Warm Reply AI**: 부모님의 메시지 의도를 고려해 따뜻한 답장 문구 제안
- **케어 리포트**: 안부, 건강 메모, 생활 리듬 등 동의 기반 신호를 요약
- **케어 액션/선물 추천**: 선물 구매보다 관계 회복과 케어 행동 중심의 추천 제공

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
- `/child/care`
- `/child/gift`

### 부모님 앱 화면

- `/parent/home`

### 디자인 레퍼런스

- `/design/app-concept`
- `/design/onboarding-flow`

## 기술 스택

- **Framework**: Next.js App Router
- **Language**: TypeScript
- **UI**: React, Tailwind CSS, inline style 기반 레퍼런스 변환
- **Icons**: lucide-react
- **State**: React local state, localStorage
- **Data**: `lib/mockData.ts` 기반 mock data

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

현재 버전은 발표 및 사용자 흐름 검증을 위한 **mock data 기반 MVP**입니다. 서버, 데이터베이스, 실제 AI API, 실제 권한 연동은 아직 연결되어 있지 않습니다.

구현된 동작은 다음과 같습니다.

- 역할 선택 시 `localStorage`에 `child` 또는 `parent` 저장
- `/` 또는 `/home` 진입 시 저장된 역할에 따라 자녀 홈 또는 부모 홈으로 이동
- 부모 홈에서 안부 버튼 클릭 시 전송 상태 메시지 표시
- 자녀 안부 화면에서 빠른 답장 선택 시 최근 답장 반영
- 선물/케어 추천 화면에서 추천 카드 클릭 시 추천 이유 모달 표시
- 부모님이 동의한 정보만 공유한다는 안내 및 공유 정보 선택 UI 제공

## 향후 계획

- 실제 AI API 연동을 통한 대화 타이밍, 말투, 주제 추천 고도화
- DB 연동을 통한 가족 구성원, 안부 기록, 동의 설정 저장
- 가족 초대 링크 및 초대 수락 플로우 구현
- 동의 기반 데이터 공유 정책과 권한 관리 기능 확장
- 부모님용 큰 글씨 모드와 접근성 옵션 고도화
- 실제 알림, 메시지, 케어 리포트 자동 생성 기능 연동
