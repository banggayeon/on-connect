import { EMOTION_TAXONOMY } from "@/lib/emotion/emotionTaxonomy";
import type {
  EmotionAnalysisRequest,
  EmotionContextAnalysisResult,
  WarmReplyOption,
} from "@/lib/types";

// ============================================
// 메인 분석 함수
// ============================================
export async function analyzeEmotion(
  request: EmotionAnalysisRequest
): Promise<EmotionContextAnalysisResult> {
  const useRealAI =
    process.env.USE_REAL_AI === "true" ||
    process.env.NEXT_PUBLIC_USE_REAL_AI === "true";
  if (useRealAI) {
    return analyzeEmotionWithLLM(request);
  }
  return analyzeEmotionMock(request);
}

// ============================================
// 정서 맥락 분석 (Mock)
// named export — API 라우트에서 직접 import
// ============================================
export function analyzeEmotionMock(
  req: EmotionAnalysisRequest
): EmotionContextAnalysisResult {
  const text = req.messageText;
  const isFromParent = req.senderRole === "parent";
  const context = req.context ?? {};

  const keywordSignals = extractKeywordSignals(text, isFromParent);
  const contextFactors = analyzeContextFactors(text, context, isFromParent);
  const possibleSignals = combineSignals(keywordSignals, contextFactors);
  const confidence = determineConfidence(text, contextFactors, possibleSignals);
  const recommendedStrategy = determineStrategy(possibleSignals, contextFactors, isFromParent);
  const granularityScore = calculateGranularity(text);
  const accommodationLevel = judgeAccommodation(text, isFromParent);
  const suggestedReplies = generateMockReplies(recommendedStrategy.style, possibleSignals);
  const caution = generateCaution(text, confidence, contextFactors);

  return {
    confidence,
    surfaceMeaning: generateSurfaceMeaning(text, isFromParent),
    possibleSignals,
    contextFactors,
    caution,
    recommendedStrategy,
    suggestedReplies,
    _internal: {
      granularityScore,
      accommodationLevel,
    },
  };
}

// ============================================
// 헬퍼 함수들
// ============================================

type Signal = { emotion: string; likelihood: "low" | "medium" | "high"; reason: string };
type ContextFactor = { factor: string; source: "message" | "pattern" | "rhythm" | "profile"; impact: "low" | "medium" | "high" };

function extractKeywordSignals(text: string, isFromParent: boolean): Signal[] {
  const signals: Signal[] = [];

  if (isFromParent) {
    if (/밥|먹었|식사|아침|점심|저녁/.test(text)) {
      signals.push(
        { emotion: "worry", likelihood: "medium", reason: "식사 관련 안부는 건강 걱정의 표현일 수 있어요" },
        { emotion: "longing", likelihood: "low", reason: "일상적 안부를 통해 연결을 유지하려는 신호일 수 있어요" }
      );
    }
    if (/보고\s?싶|언제\s?(와|올)|집에\s?(와|올)/.test(text)) {
      signals.push(
        { emotion: "longing", likelihood: "high", reason: "직접적인 그리움 표현이에요" },
        { emotion: "loneliness", likelihood: "medium", reason: "그리움의 배경에 외로움이 있을 수 있어요" }
      );
    }
    if (/괜찮|아프|병원|감기|피곤/.test(text)) {
      signals.push(
        { emotion: "worry", likelihood: "high", reason: "건강에 대한 직접적인 걱정 표현이에요" }
      );
    }
    if (/잘\s?지내|뭐\s?하|뭐해|어떻게\s?지내/.test(text)) {
      signals.push(
        { emotion: "curiosity", likelihood: "medium", reason: "근황이 궁금한 표현이에요" },
        { emotion: "longing", likelihood: "low", reason: "대화를 나누고 싶은 마음일 수 있어요" }
      );
    }
    if (/잘했|대단|자랑|기특|역시/.test(text)) {
      signals.push(
        { emotion: "pride", likelihood: "high", reason: "직접적인 칭찬과 자부심 표현이에요" }
      );
    }
    if (/걱정|조심|위험|늦게|일찍/.test(text)) {
      signals.push(
        { emotion: "worry", likelihood: "high", reason: "안전에 대한 직접적 걱정이에요" },
        { emotion: "helplessness", likelihood: "low", reason: "직접 돌봐줄 수 없는 상황에서 오는 마음일 수 있어요" }
      );
    }
    if (/고마|감사|덕분/.test(text)) {
      signals.push(
        { emotion: "gratitude", likelihood: "high", reason: "직접적인 감사 표현이에요" }
      );
    }
    if (/미안|못\s?해|바빠서/.test(text)) {
      signals.push(
        { emotion: "guilt", likelihood: "medium", reason: "미안함의 표현일 수 있어요" },
        { emotion: "disappointment", likelihood: "low", reason: "기대에 못 미치는 상황에 대한 속상함일 수 있어요" }
      );
    }
  } else {
    if (/^(ㅇㅇ|ㅇ|ㅎㅎ|ㅋ+|ㄴ|ㄱㄱ|ㅎ)$/.test(text.trim())) {
      signals.push(
        { emotion: "comfort", likelihood: "low", reason: "감정 표현이 거의 없어서 상태를 판단하기 어려워요" }
      );
    }
    if (/^(응|네|먹었|했어|그래|알겠)/.test(text.trim()) && text.length < 10) {
      signals.push(
        { emotion: "comfort", likelihood: "low", reason: "간단한 확인 답변이라 특별한 감정 신호는 약해요" }
      );
    }
    if (/보고\s?싶|가고\s?싶|만나고\s?싶/.test(text)) {
      signals.push(
        { emotion: "longing", likelihood: "high", reason: "직접적인 그리움 표현이에요" },
        { emotion: "guilt", likelihood: "medium", reason: "자주 못 찾아뵈는 미안함이 함께 있을 수 있어요" }
      );
    }
    if (/걱정|괜찮으세요|조심하세요|건강/.test(text)) {
      signals.push(
        { emotion: "worry", likelihood: "medium", reason: "부모님 건강에 대한 걱정이에요" },
        { emotion: "affection", likelihood: "medium", reason: "걱정 뒤에 깊은 유대감이 있을 수 있어요" }
      );
    }
  }

  if (signals.length === 0) {
    signals.push(
      { emotion: "comfort", likelihood: "low", reason: "뚜렷한 감정 신호를 찾기 어려워요. 맥락 정보가 더 필요해요" }
    );
  }

  return signals;
}

function analyzeContextFactors(
  text: string,
  context: NonNullable<EmotionAnalysisRequest["context"]>,
  _isFromParent: boolean
): ContextFactor[] {
  const factors: ContextFactor[] = [];

  if (text.length <= 3) {
    factors.push({ factor: "메시지가 매우 짧음", source: "message", impact: "medium" });
  }
  if (text.includes("?")) {
    factors.push({ factor: "질문형 메시지", source: "message", impact: "low" });
  }
  if (/[!]{2,}|[.]{3,}/.test(text)) {
    factors.push({ factor: "강조 표현(느낌표/말줄임표) 사용", source: "message", impact: "low" });
  }

  if (context.daysSinceLastContact !== undefined) {
    if (context.daysSinceLastContact >= 7) {
      factors.push({ factor: `마지막 연락 후 ${context.daysSinceLastContact}일 경과`, source: "rhythm", impact: "high" });
    } else if (context.daysSinceLastContact >= 3) {
      factors.push({ factor: `마지막 연락 후 ${context.daysSinceLastContact}일 경과`, source: "rhythm", impact: "medium" });
    }
  }

  if (context.usualMessageLength) {
    const currentLength = text.length <= 5 ? "short" : text.length <= 20 ? "medium" : "long";
    if (context.usualMessageLength === "long" && currentLength === "short") {
      factors.push({ factor: "평소보다 답장이 많이 짧아짐", source: "pattern", impact: "high" });
    } else if (context.usualMessageLength === "medium" && currentLength === "short") {
      factors.push({ factor: "평소보다 답장이 짧아짐", source: "pattern", impact: "medium" });
    }
  }

  if (context.recentCheckInMoods && context.recentCheckInMoods.length >= 3) {
    const recent = context.recentCheckInMoods.slice(-3);
    const avgMood = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (avgMood <= 2.5) {
      factors.push({ factor: "최근 체크인에서 기분이 저하 추세", source: "profile", impact: "high" });
    } else if (avgMood <= 3.5) {
      factors.push({ factor: "최근 체크인에서 기분이 보통 수준", source: "profile", impact: "low" });
    }
  }

  if (context.recentMessages && context.recentMessages.length >= 2) {
    const parentMsgs = context.recentMessages.filter((m) => m.sender === "parent");
    const childMsgs = context.recentMessages.filter((m) => m.sender === "child");
    if (parentMsgs.length > 0 && childMsgs.length === 0) {
      factors.push({ factor: "부모님만 연락하고 자녀 답장이 없었음", source: "pattern", impact: "high" });
    }
    if (parentMsgs.length >= 2) {
      const lengths = parentMsgs.map((m) => m.text.length);
      const isDecreasing = lengths.every((len, i) => i === 0 || len <= lengths[i - 1]);
      if (isDecreasing && lengths[lengths.length - 1] < lengths[0] * 0.5) {
        factors.push({ factor: "부모님 메시지 길이가 점점 줄어드는 추세", source: "pattern", impact: "medium" });
      }
    }
  }

  return factors;
}

function combineSignals(keywordSignals: Signal[], contextFactors: ContextFactor[]): Signal[] {
  const signals = [...keywordSignals];

  const hasHighImpactRhythm = contextFactors.some((f) => f.source === "rhythm" && f.impact === "high");
  const hasPatternChange = contextFactors.some((f) => f.source === "pattern" && f.impact === "high");
  const hasMoodDecline = contextFactors.some((f) => f.source === "profile" && f.impact === "high");

  if (hasHighImpactRhythm && !signals.some((s) => s.emotion === "loneliness")) {
    signals.push({
      emotion: "loneliness",
      likelihood: "medium",
      reason: "연락이 뜸한 기간이 길어 외로움의 신호일 수 있어요",
    });
  }

  if (hasPatternChange && !signals.some((s) => s.emotion === "disappointment")) {
    signals.push({
      emotion: "disappointment",
      likelihood: "low",
      reason: "평소와 다른 패턴이 감지되어, 서운함의 가능성도 있어요",
    });
  }

  if (hasMoodDecline) {
    signals.forEach((s) => {
      if ((s.emotion === "loneliness" || s.emotion === "disappointment") && s.likelihood === "low") {
        s.likelihood = "medium";
        s.reason += " (최근 기분 체크인 추세도 이를 뒷받침해요)";
      }
    });
  }

  const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
  signals.sort((a, b) => order[a.likelihood] - order[b.likelihood]);
  return signals.slice(0, 4);
}

function determineConfidence(
  text: string,
  contextFactors: ContextFactor[],
  signals: Signal[]
): "low" | "medium" | "high" {
  if (text.length <= 5 && contextFactors.length <= 1) return "low";
  if (text.length > 30 && signals.some((s) => s.likelihood === "high")) return "high";
  if (contextFactors.length >= 3) return "medium";
  return "medium";
}

function determineStrategy(
  signals: Signal[],
  contextFactors: ContextFactor[],
  isFromParent: boolean
): { style: string; reason: string } {
  const topSignal = signals[0];
  const hasLongGap = contextFactors.some((f) => f.source === "rhythm" && f.impact === "high");

  if (!topSignal || topSignal.likelihood === "low") {
    return { style: "light_check", reason: "뚜렷한 감정 신호가 약해서, 가볍게 안부를 확인하는 게 좋겠어요" };
  }

  if (hasLongGap && !isFromParent) {
    return { style: "apologize_first", reason: "연락이 뜸했으니, 먼저 마음을 전하면 대화가 자연스러워져요" };
  }

  const strategyMap: Record<string, { style: string; reason: string }> = {
    loneliness:    { style: "direct_call",      reason: "외로움의 신호가 있어서, 텍스트보다 목소리가 더 위로가 돼요" },
    worry:         { style: "warm_acknowledge",  reason: "걱정하는 마음이 보여서, 괜찮다는 걸 따뜻하게 전해주세요" },
    disappointment:{ style: "warm_acknowledge",  reason: "서운한 마음이 있을 수 있어서, 공감을 먼저 표현해보세요" },
    longing:       { style: "warm_acknowledge",  reason: "그리움의 신호가 있어서, 만남이나 통화 약속을 제안해보세요" },
    guilt:         { style: "apologize_first",   reason: "미안한 마음이 보여서, 먼저 마음을 전하면 좋겠어요" },
    frustration:   { style: "give_space",        reason: "답답함의 신호가 있어서, 잠시 여유를 드리는 것도 방법이에요" },
    pride:         { style: "warm_acknowledge",  reason: "자부심을 느끼고 계셔서, 함께 기뻐해주면 좋겠어요" },
    curiosity:     { style: "light_check",       reason: "궁금해하고 계셔서, 일상을 구체적으로 공유해보세요" },
    gratitude:     { style: "warm_acknowledge",  reason: "감사를 전하고 계셔서, 감사로 답하면 관계가 따뜻해져요" },
  };

  return strategyMap[topSignal.emotion] ?? { style: "light_check", reason: "가볍게 안부를 확인하는 것부터 시작해보세요" };
}

function generateSurfaceMeaning(text: string, _isFromParent: boolean): string {
  if (/밥|먹었|식사/.test(text)) return "식사 여부를 확인하고 있어요";
  if (/보고\s?싶/.test(text)) return "보고 싶다는 표현이에요";
  if (/괜찮|아프|병원/.test(text)) return "건강 상태를 걱정하고 있어요";
  if (/잘\s?지내|뭐\s?하/.test(text)) return "근황을 물어보고 있어요";
  if (/고마|감사/.test(text)) return "감사를 전하고 있어요";
  if (text.length <= 3) return "짧은 답변이에요";
  return "일상적인 대화예요";
}

function generateCaution(
  text: string,
  confidence: "low" | "medium" | "high",
  _contextFactors: ContextFactor[]
): string {
  if (confidence === "low") {
    if (text.length <= 5) return "메시지가 짧아서 맥락 정보에 의존한 분석이에요. 참고로만 봐주세요.";
    return "분석에 필요한 맥락 정보가 부족해요. 대화가 쌓이면 더 정확해져요.";
  }
  if (confidence === "medium") return "몇 가지 신호를 감지했지만, 실제 마음은 다를 수 있어요.";
  return "비교적 뚜렷한 신호가 있지만, 직접 대화로 확인하는 게 가장 좋아요.";
}

function calculateGranularity(text: string): number {
  let score = 0.1;
  if (text.length > 5) score += 0.1;
  if (text.length > 15) score += 0.15;
  if (text.length > 30) score += 0.15;
  const emotionWords = ["고마", "보고싶", "사랑", "걱정", "미안", "기쁘", "좋아", "뿌듯", "서운", "외로"];
  score += emotionWords.filter((w) => text.includes(w)).length * 0.1;
  if (text.includes("?")) score += 0.1;
  return Math.min(score, 1.0);
}

function judgeAccommodation(text: string, isFromParent: boolean): "under" | "appropriate" | "over" {
  if (isFromParent) {
    const worryWords = ["조심", "걱정", "위험", "하지마", "하지 마"];
    if (worryWords.filter((w) => text.includes(w)).length >= 2) return "over";
    return "appropriate";
  }
  if (text.length <= 3) return "under";
  if (text.length <= 8 && !text.includes("?")) return "under";
  return "appropriate";
}

const STRATEGY_REPLIES: Record<string, WarmReplyOption[]> = {
  light_check: [
    {
      text: "엄마 오늘 뭐 하셨어요?",
      tone: "casual",
      emotionExpressed: ["curiosity"],
      expressionLevel: "moderate",
      reason: "가볍게 일상을 물어보는 답장이에요",
    },
    {
      text: "엄마! 오늘 하루 어떠셨어요? 나는 오늘 이런 일이 있었어요~",
      tone: "warm",
      emotionExpressed: ["curiosity", "joy"],
      expressionLevel: "rich",
      reason: "내 일상도 공유하면서 대화를 열어요",
    },
  ],
  warm_acknowledge: [
    {
      text: "응 먹었어요! 엄마도 맛있는 거 드셨어요?",
      tone: "warm",
      emotionExpressed: ["relief", "curiosity"],
      expressionLevel: "moderate",
      reason: "걱정에 안도감을 주면서 관심을 표현해요",
    },
    {
      text: "엄마 걱정해줘서 고마워요 오늘 맛있게 먹었어요! 엄마는요?",
      tone: "warm",
      emotionExpressed: ["gratitude", "curiosity", "affection"],
      expressionLevel: "rich",
      reason: "감사 + 관심으로 마음이 더 잘 전달돼요",
    },
    {
      text: "먹었어~ 엄마도 잘 챙겨 드세요!",
      tone: "casual",
      emotionExpressed: ["comfort", "worry"],
      expressionLevel: "moderate",
      reason: "가볍지만 엄마 건강도 챙기는 표현이에요",
    },
  ],
  give_space: [
    {
      text: "엄마 오늘 푹 쉬세요. 내일 전화할게요!",
      tone: "warm",
      emotionExpressed: ["affection"],
      expressionLevel: "moderate",
      reason: "여유를 드리면서 구체적 약속으로 안심시켜요",
    },
  ],
  direct_call: [
    {
      text: "엄마 지금 통화해도 돼요? 목소리 듣고 싶어요",
      tone: "warm",
      emotionExpressed: ["longing", "affection"],
      expressionLevel: "rich",
      reason: "외로움에는 텍스트보다 목소리가 더 위로가 돼요",
    },
    {
      text: "엄마 오늘 저녁에 전화해도 돼요?",
      tone: "casual",
      emotionExpressed: ["curiosity"],
      expressionLevel: "moderate",
      reason: "부담 없이 통화를 제안하는 방법이에요",
    },
  ],
  apologize_first: [
    {
      text: "엄마 요즘 연락 못 드려서 미안해요. 오늘 저녁에 전화할게요!",
      tone: "warm",
      emotionExpressed: ["guilt", "affection"],
      expressionLevel: "rich",
      reason: "미안함을 먼저 전하고 구체적 행동을 약속해요",
    },
    {
      text: "엄마 바빠서 연락이 늦었어요 요즘 어떻게 지내세요?",
      tone: "warm",
      emotionExpressed: ["guilt", "curiosity"],
      expressionLevel: "moderate",
      reason: "사과 + 관심으로 대화를 자연스럽게 열어요",
    },
  ],
};

function generateMockReplies(strategy: string, _signals: Signal[]): WarmReplyOption[] {
  return STRATEGY_REPLIES[strategy] ?? STRATEGY_REPLIES["light_check"];
}

// ============================================
// 실제 LLM 감정 분석 (real 모드, 확장 포인트)
// ============================================
async function analyzeEmotionWithLLM(
  req: EmotionAnalysisRequest
): Promise<EmotionContextAnalysisResult> {
  const prompt = `당신은 부모-자녀 간 메시지의 정서 맥락을 분석하는 전문가입니다.

## 중요 원칙
- 단일 메시지만으로 감정을 확정하지 마세요.
- 메시지 + 맥락을 함께 고려하여 "가능한 정서 신호"를 제시하세요.
- 결과는 단정이 아닌 가능성으로 표현하세요.
- 학술 배경: Conceptual Act Theory (Barrett) — 감정은 맥락 속에서 구성됩니다.

## 분석 대상
- 보낸 사람: ${req.senderRole === "parent" ? "부모님" : "자녀"}${req.senderName ? ` (${req.senderName})` : ""}
- 받는 사람: ${req.receiverRole === "parent" ? "부모님" : "자녀"}
- 메시지: "${req.messageText}"
${req.context?.recentMessages ? `- 최근 대화:\n${req.context.recentMessages.map((m) => `  ${m.sender}: ${m.text}`).join("\n")}` : ""}
${req.context?.daysSinceLastContact ? `- 마지막 연락: ${req.context.daysSinceLastContact}일 전` : ""}
${req.context?.usualMessageLength ? `- 평소 메시지 길이: ${req.context.usualMessageLength}` : ""}

## 감정 후보 목록
${Object.entries(EMOTION_TAXONOMY).map(([id, def]) => `- ${id}: ${def.ko} — ${def.description}`).join("\n")}

## 대응 전략 종류
- light_check: 가볍게 안부 확인
- warm_acknowledge: 따뜻하게 공감
- give_space: 여유 주기
- direct_call: 직접 전화 제안
- apologize_first: 먼저 마음 전하기

## 출력 형식 (JSON만, 다른 텍스트 없이)
{
  "confidence": "low|medium|high",
  "surfaceMeaning": "표면적 의미 한 문장",
  "possibleSignals": [
    { "emotion": "감정id", "likelihood": "low|medium|high", "reason": "이유" }
  ],
  "contextFactors": [
    { "factor": "요인 설명", "source": "message|pattern|rhythm|profile", "impact": "low|medium|high" }
  ],
  "caution": "분석 한계 안내 한 문장",
  "recommendedStrategy": { "style": "전략id", "reason": "이유" }
}`;

  try {
    const response = await fetch("/api/ai/emotion-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, request: req }),
    });
    const llmResult = await response.json();

    // LLM은 suggestedReplies와 _internal을 제공하지 않으므로 mock으로 채움
    const mockBase = analyzeEmotionMock(req);
    return {
      ...mockBase,
      confidence: llmResult.confidence ?? mockBase.confidence,
      surfaceMeaning: llmResult.surfaceMeaning ?? mockBase.surfaceMeaning,
      possibleSignals: llmResult.possibleSignals ?? mockBase.possibleSignals,
      contextFactors: llmResult.contextFactors ?? mockBase.contextFactors,
      caution: llmResult.caution ?? mockBase.caution,
      recommendedStrategy: llmResult.recommendedStrategy ?? mockBase.recommendedStrategy,
      suggestedReplies: generateMockReplies(
        (llmResult.recommendedStrategy?.style ?? mockBase.recommendedStrategy.style),
        llmResult.possibleSignals ?? mockBase.possibleSignals
      ),
    };
  } catch (error) {
    console.error("LLM 감정 분석 실패, mock으로 fallback:", error);
    return analyzeEmotionMock(req);
  }
}
