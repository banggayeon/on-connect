# AI Experimental Modules

이 폴더는 온커넥트의 향후 AI 기능을 미리 구체화하기 위한 격리된 실험 영역입니다.

현재 앱의 화면, API route, pipeline, relationship engine에는 연결되어 있지 않습니다. 여기의 코드는 개발자가 수동으로 import해 타입, mock 분석, prompt builder, 시나리오를 확인하는 용도입니다.

## 설계 의도

부모-자녀 대화는 "어", "ㅇㅇ", "밥 먹었니?"처럼 짧고 암시적인 경우가 많습니다. 이 모듈은 메시지 하나만으로 감정을 확정하지 않고, 메시지 자체와 최근 대화 흐름, 평소 답장 길이, 마지막 연락일, 최근 분위기, 부모님의 소통 방식을 함께 참고합니다.

결과도 단정형 감정 판정이 아니라 "걱정의 신호일 수 있음", "그리움이나 외로움의 가능성이 있음"처럼 가능한 정서 신호와 맥락 요인 중심으로 제공합니다.

## 이론 반영 방식

감정 세분화 이론은 `emotionTaxonomy.ts`의 세분화된 감정 후보와 `possibleSignals` 구조에 반영되어 있습니다. 하나의 감정으로 확정하지 않고 여러 정서 후보의 가능성을 나란히 제공합니다.

커뮤니케이션 수용 이론은 `accommodationAnalyzer.ts`와 답장 전략에 반영되어 있습니다. 답장이 너무 짧아 무심하게 느껴질 수 있는지, 걱정 표현이 반복되어 부담이 될 수 있는지, 공감과 일상 공유 및 되묻기가 균형 있게 들어갔는지를 mock 기준으로 판단합니다.

## 파일 역할

- `contextTypes.ts`: 정서 맥락 분석 입력, 결과, 답장 옵션, 전략 타입을 정의합니다.
- `emotionTaxonomy.ts`: 부모-자녀 맥락에 맞춘 warmth, concern, daily 감정 후보 분류를 정의합니다.
- `emotionContextAnalyzer.ts`: 키워드, 메시지 길이, 연락 리듬, 최근 분위기, 소통 방식을 조합하는 mock 분석 엔진입니다.
- `accommodationAnalyzer.ts`: under, appropriate, over 수준을 판단하고 설명합니다.
- `replyStrategyGenerator.ts`: 분석 결과에 맞는 Warm Reply 후보를 생성합니다.
- `promptBuilders.ts`: 실제 LLM 호출 없이 향후 연결용 프롬프트 문자열만 생성합니다.
- `mockScenarios.ts`: 최소 시나리오 8개를 `EmotionContextAnalysisInput` 형태로 제공합니다.
- `evaluationHelpers.ts`: mock 시나리오를 순수 함수로 실행하고 결과를 요약합니다.
- `index.ts`: 실험 모듈의 수동 import를 위한 export 모음입니다.

## 향후 연결 계획

1. `/api/ai/emotion-analyze`와 통합합니다.
2. Warm Reply 화면에 분석 결과와 답장 전략을 적용합니다.
3. Parent Briefing / Care Action에서 정서 맥락 분석 결과를 활용합니다.
4. 실제 LLM 호출을 연결하되, prompt builder의 JSON 원칙과 사용자 제공 데이터 제한을 유지합니다.
5. 사용자 피드백을 기반으로 추천 전략과 답장 후보를 개선합니다.

