import type { EmotionContextAnalysisInput, EmotionContextAnalysisResult } from "./contextTypes";

export interface ParentBriefingPromptContext {
  parentName?: string;
  childName?: string;
  userProvidedMessages?: string[];
  userProvidedNotes?: string[];
  recentAnalysis?: EmotionContextAnalysisResult[];
}

export interface CareActionPromptContext {
  parentName?: string;
  childName?: string;
  userProvidedMessages?: string[];
  userProvidedNotes?: string[];
  relationshipRhythm?: string;
  recentAnalysis?: EmotionContextAnalysisResult[];
}

function stringifyForPrompt(value: unknown) {
  return JSON.stringify(value, null, 2);
}

const sharedPrinciples = [
  "감정을 확정하지 말고 가능한 정서 신호로만 제시한다.",
  "부모-자녀 관계에서 세대별 표현 차이, 짧은 답장, 암시적 안부 표현을 고려한다.",
  "사용자가 직접 제공한 메시지와 메모만 사용한다.",
  "카카오톡, 문자, 통화 기록이 자동 수집된다는 전제를 두지 않는다.",
  "결과는 설명 문장이 포함된 JSON으로만 반환한다.",
].join("\n- ");

export function buildEmotionContextAnalysisPrompt(input: EmotionContextAnalysisInput) {
  return `너는 부모-자녀 대화의 정서 맥락을 가능성 중심으로 분석하는 도우미다.

원칙:
- ${sharedPrinciples}

분석 입력:
${stringifyForPrompt(input)}

반환 JSON 스키마:
{
  "confidence": "low | medium | high",
  "surfaceMeaning": "겉으로 확인되는 메시지 의미",
  "possibleSignals": [
    { "emotion": "taxonomy id", "likelihood": "low | medium | high", "reason": "가능성 중심 이유" }
  ],
  "contextFactors": ["메시지 길이, 최근 흐름, 연락 리듬, 말투 관련 요인"],
  "caution": "단정하지 말라는 주의 문장",
  "recommendedStrategy": { "style": "reply strategy id", "reason": "전략 추천 이유" },
  "internalMetrics": {
    "granularityScore": 0,
    "accommodationLevel": "under | appropriate | over",
    "messageLengthScore": 0,
    "contextRichnessScore": 0
  }
}`;
}

export function buildWarmReplyPrompt(
  input: EmotionContextAnalysisInput,
  analysis: EmotionContextAnalysisResult
) {
  return `너는 부모-자녀 관계에 맞는 따뜻한 답장 후보를 만드는 도우미다.

원칙:
- ${sharedPrinciples}
- 답장은 상대의 정서 신호를 단정하지 않고 부드럽게 받아준다.
- 짧은 일상 공유, 걱정에 대한 인정, 되묻기, 통화 제안 중 맥락에 맞는 방식을 고른다.

입력 메시지:
${stringifyForPrompt(input)}

정서 맥락 분석:
${stringifyForPrompt(analysis)}

반환 JSON 스키마:
{
  "suggestedReplies": [
    {
      "text": "실제 답장 문장",
      "tone": "casual | warm | gentle | formal",
      "strategy": "reply strategy id",
      "expressedSignals": ["반영한 possible signal id"],
      "reason": "이 답장이 적절한 이유",
      "displayLabel": "화면 표시용 짧은 라벨"
    }
  ]
}`;
}

export function buildParentBriefingPrompt(context: ParentBriefingPromptContext) {
  return `너는 부모님에게 보여줄 짧고 부드러운 브리핑 초안을 만드는 도우미다.

원칙:
- ${sharedPrinciples}
- 자녀의 감정을 확정하거나 평가하지 않는다.
- 부모님이 부담 없이 이해할 수 있는 문장으로 최근 흐름과 가능한 배려 포인트를 요약한다.

사용자가 직접 제공한 컨텍스트:
${stringifyForPrompt(context)}

반환 JSON 스키마:
{
  "briefingTitle": "짧은 제목",
  "summary": "가능성 중심 요약",
  "contextFactors": ["참고한 사용자 제공 정보"],
  "gentleSuggestions": ["부모님이 시도해볼 수 있는 표현"],
  "caution": "단정하지 말라는 주의 문장"
}`;
}

export function buildCareActionPrompt(context: CareActionPromptContext) {
  return `너는 자녀가 부모님께 할 수 있는 케어 액션 후보를 만드는 도우미다.

원칙:
- ${sharedPrinciples}
- 부모님의 감정을 확정하지 않고 가능한 정서 신호와 생활 맥락을 함께 본다.
- 큰 행동보다 실행 가능한 작은 연락, 방문, 질문, 선물, 건강 확인을 우선한다.

사용자가 직접 제공한 컨텍스트:
${stringifyForPrompt(context)}

반환 JSON 스키마:
{
  "careActions": [
    {
      "label": "짧은 액션명",
      "actionType": "message | call | visit | reminder | gift | question",
      "reason": "가능한 정서 신호와 연결한 추천 이유",
      "sampleMessage": "필요한 경우 사용할 문장"
    }
  ],
  "caution": "부담을 주지 않도록 조심할 점"
}`;
}

