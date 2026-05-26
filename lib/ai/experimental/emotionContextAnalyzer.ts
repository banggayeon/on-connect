import { analyzeAccommodationLevel } from "./accommodationAnalyzer";
import { generateReplyOptions } from "./replyStrategyGenerator";
import type {
  ConfidenceLevel,
  EmotionContextAnalysisInput,
  EmotionContextAnalysisResult,
  LikelihoodLevel,
  PossibleEmotionSignal,
  ReplyStrategy,
} from "./contextTypes";

const QUESTION_RE = /[?？]|\b(니|나요|까요|세요)\??$/;
const EMOTION_WORD_RE = /(고마|미안|보고\s?싶|걱정|속상|기쁘|다행|외롭|힘들|답답|서운|괜찮)/;
const MEAL_RE = /(밥|식사|아침|점심|저녁|먹었|챙겨)/;
const HEALTH_RE = /(아프|허리|병원|약|감기|건강|괜찮)/;
const VISIT_RE = /(언제|집|오니|와|방문|얼굴|보자)/;
const SAFETY_RE = /(조심|늦게|위험|운전|길)/;
const SHORT_ACK_RE = /^(어|응|ㅇㅇ|ㅇ|그래|네|알겠|괜찮다)$/;

function currentLength(text: string): "short" | "medium" | "long" {
  const length = text.trim().length;
  if (length <= 5) return "short";
  if (length <= 24) return "medium";
  return "long";
}

function scoreLikelihood(base: LikelihoodLevel, bump: boolean): LikelihoodLevel {
  if (!bump) return base;
  if (base === "low") return "medium";
  if (base === "medium") return "high";
  return "high";
}

function addSignal(signals: PossibleEmotionSignal[], next: PossibleEmotionSignal) {
  const existing = signals.find((signal) => signal.emotion === next.emotion);
  if (!existing) {
    signals.push(next);
    return;
  }
  if (existing.likelihood === "low" && next.likelihood !== "low") existing.likelihood = next.likelihood;
  if (existing.likelihood === "medium" && next.likelihood === "high") existing.likelihood = "high";
  existing.reason = `${existing.reason} ${next.reason}`;
}

function extractSignals(input: EmotionContextAnalysisInput, factors: string[]): PossibleEmotionSignal[] {
  const text = input.messageText.trim();
  const signals: PossibleEmotionSignal[] = [];
  const days = input.relationshipContext?.daysSinceLastContact ?? 0;
  const longGap = days >= 7;

  if (MEAL_RE.test(text)) {
    addSignal(signals, {
      emotion: "worry",
      likelihood: scoreLikelihood("medium", input.relationshipContext?.parentCommunicationStyle === "worrying"),
      reason: "식사와 건강을 챙기려는 표현일 수 있습니다.",
    });
    addSignal(signals, {
      emotion: "routine_check",
      likelihood: "medium",
      reason: "가족 사이에서 자주 쓰는 일상 확인 표현일 수 있습니다.",
    });
    addSignal(signals, {
      emotion: "longing",
      likelihood: scoreLikelihood("low", longGap),
      reason: "안부를 계기로 대화를 이어가고 싶은 마음이 담겼을 수 있습니다.",
    });
  }

  if (VISIT_RE.test(text) || /보고\s?싶/.test(text)) {
    addSignal(signals, {
      emotion: "longing",
      likelihood: "high",
      reason: "만남이나 얼굴을 보고 싶은 마음이 비교적 직접적으로 드러납니다.",
    });
    addSignal(signals, {
      emotion: "loneliness",
      likelihood: scoreLikelihood("medium", longGap),
      reason: "연락이나 만남의 간격이 길었다면 외로움의 신호일 수 있습니다.",
    });
  }

  if (HEALTH_RE.test(text)) {
    addSignal(signals, {
      emotion: "worry",
      likelihood: input.senderRole === "parent" ? "medium" : "high",
      reason: "건강 상태를 중심으로 살피거나 도움을 바라는 신호일 수 있습니다.",
    });
    if (/허리|아프|병원|약/.test(text)) {
      addSignal(signals, {
        emotion: "helplessness",
        likelihood: "low",
        reason: "몸 상태를 전하면서도 크게 부담 주고 싶지 않은 마음이 섞였을 수 있습니다.",
      });
    }
  }

  if (/괜찮다|그래|알았다/.test(text)) {
    addSignal(signals, {
      emotion: "comfort",
      likelihood: "low",
      reason: "겉으로는 상황을 받아들이는 짧은 확인 표현입니다.",
    });
    addSignal(signals, {
      emotion: "disappointment",
      likelihood: scoreLikelihood("low", longGap),
      reason: "앞선 연락 공백이나 기대가 있었다면 서운함의 신호일 수 있습니다.",
    });
  }

  if (/요즘\s?바쁘|바쁘니|뭐\s?하|뭐하니/.test(text)) {
    addSignal(signals, {
      emotion: "curiosity",
      likelihood: "medium",
      reason: "근황을 알고 싶은 일상적 관심으로 볼 수 있습니다.",
    });
    addSignal(signals, {
      emotion: "loneliness",
      likelihood: scoreLikelihood("low", longGap),
      reason: "연락이 뜸했다면 대화를 시작하고 싶은 쓸쓸함의 신호일 수 있습니다.",
    });
  }

  if (SAFETY_RE.test(text)) {
    addSignal(signals, {
      emotion: "worry",
      likelihood: "medium",
      reason: "안전과 생활 리듬을 염려하는 가족식 표현일 수 있습니다.",
    });
  }

  if (SHORT_ACK_RE.test(text)) {
    addSignal(signals, {
      emotion: "comfort",
      likelihood: "low",
      reason: "짧은 수락이나 확인일 수 있어 강한 감정으로 보기는 어렵습니다.",
    });
    addSignal(signals, {
      emotion: "disappointment",
      likelihood: factors.some((factor) => factor.includes("평소보다")) ? "low" : "low",
      reason: "맥락에 따라 무심함이나 서운함으로 받아들여질 여지도 있습니다.",
    });
    addSignal(signals, {
      emotion: "frustration",
      likelihood: "low",
      reason: "대화를 길게 이어가기 어려운 상태의 신호일 수 있습니다.",
    });
  }

  if (signals.length === 0) {
    addSignal(signals, {
      emotion: "comfort",
      likelihood: "low",
      reason: "뚜렷한 감정어가 없어 일상적인 확인 표현일 가능성이 있습니다.",
    });
  }

  return signals.slice(0, 5);
}

function analyzeFactors(input: EmotionContextAnalysisInput): string[] {
  const text = input.messageText.trim();
  const context = input.relationshipContext;
  const factors: string[] = [];

  factors.push(`메시지 길이는 ${currentLength(text)} 범위입니다.`);
  if (QUESTION_RE.test(text)) factors.push("질문형 표현이 포함되어 있어 대화를 이어가려는 기능이 있습니다.");
  if (EMOTION_WORD_RE.test(text)) factors.push("감정어 또는 상태 표현이 포함되어 있습니다.");
  if (MEAL_RE.test(text)) factors.push("식사와 생활 리듬을 확인하는 가족 대화 키워드가 있습니다.");
  if (HEALTH_RE.test(text)) factors.push("건강 관련 키워드가 포함되어 있습니다.");
  if (SAFETY_RE.test(text)) factors.push("안전이나 조심을 당부하는 표현이 포함되어 있습니다.");

  if (context?.daysSinceLastContact !== undefined) {
    factors.push(`마지막 연락 이후 ${context.daysSinceLastContact}일이 지났습니다.`);
  }

  if (context?.usualReplyLength) {
    const now = currentLength(text);
    if (context.usualReplyLength !== now) {
      factors.push(`평소 답장 길이(${context.usualReplyLength})와 현재 메시지 길이(${now})가 다릅니다.`);
    } else {
      factors.push("평소 답장 길이와 크게 다르지 않습니다.");
    }
  }

  if (context?.recentMoodTrend && context.recentMoodTrend !== "unknown") {
    factors.push(`최근 분위기 흐름은 ${context.recentMoodTrend}로 제공되었습니다.`);
  }

  if (context?.parentCommunicationStyle) {
    factors.push(`부모님의 평소 소통 방식은 ${context.parentCommunicationStyle}에 가깝습니다.`);
  }

  if ((input.recentMessages ?? []).length > 0) {
    factors.push(`최근 대화 ${input.recentMessages?.length ?? 0}건을 함께 참고했습니다.`);
  }

  return factors;
}

function surfaceMeaning(input: EmotionContextAnalysisInput) {
  const text = input.messageText.trim();
  if (MEAL_RE.test(text)) return "식사 여부를 확인하는 메시지입니다.";
  if (VISIT_RE.test(text)) return "집 방문이나 만날 시점을 묻는 메시지입니다.";
  if (HEALTH_RE.test(text)) return "건강 상태나 몸 상태를 전하는 메시지입니다.";
  if (/요즘\s?바쁘|바쁘니/.test(text)) return "최근 일정이나 연락 가능성을 묻는 메시지입니다.";
  if (SHORT_ACK_RE.test(text)) return "짧게 확인하거나 응답하는 메시지입니다.";
  if (QUESTION_RE.test(text)) return "상대의 상태나 일상을 묻는 메시지입니다.";
  return "일상 대화 속에서 짧게 마음이나 상황을 전하는 메시지입니다.";
}

function contextRichnessScore(input: EmotionContextAnalysisInput) {
  let score = 0;
  if ((input.recentMessages ?? []).length > 0) score += 25;
  if (input.relationshipContext?.daysSinceLastContact !== undefined) score += 20;
  if (input.relationshipContext?.usualReplyLength) score += 15;
  if (input.relationshipContext?.recentMoodTrend && input.relationshipContext.recentMoodTrend !== "unknown") score += 20;
  if (input.relationshipContext?.parentCommunicationStyle) score += 20;
  return Math.min(100, score);
}

function messageLengthScore(text: string) {
  return Math.min(100, Math.round((text.trim().length / 40) * 100));
}

function granularityScore(signals: PossibleEmotionSignal[], factors: string[]) {
  return Math.min(100, signals.length * 12 + factors.length * 5);
}

function determineConfidence(input: EmotionContextAnalysisInput, signals: PossibleEmotionSignal[]) : ConfidenceLevel {
  const richness = contextRichnessScore(input);
  const hasStrongSignal = signals.some((signal) => signal.likelihood === "high");
  if (input.messageText.trim().length <= 3 && richness < 60) return "low";
  if (hasStrongSignal && richness >= 40) return "high";
  if (richness >= 50 || input.messageText.trim().length > 12) return "medium";
  return "low";
}

function determineStrategy(
  input: EmotionContextAnalysisInput,
  signals: PossibleEmotionSignal[]
): { style: ReplyStrategy; reason: string } {
  const days = input.relationshipContext?.daysSinceLastContact ?? 0;
  const text = input.messageText.trim();
  const emotions = new Set(signals.map((signal) => signal.emotion));

  if (days >= 14 && input.receiverRole === "parent") {
    return { style: "apologize_first", reason: "연락 공백이 길어 정서 해석보다 먼저 짧게 미안함을 전하는 편이 적절합니다." };
  }
  if (emotions.has("helplessness") || HEALTH_RE.test(text)) {
    return { style: "direct_call", reason: "건강 관련 맥락은 문자보다 통화로 상태를 확인하는 것이 도움이 될 수 있습니다." };
  }
  if (text.length <= 3) {
    return { style: "light_check", reason: "짧은 답장은 단정하지 않고 가볍게 분위기만 확인하는 편이 안전합니다." };
  }
  if (emotions.has("worry") || emotions.has("longing")) {
    return { style: "warm_acknowledge", reason: "걱정이나 그리움의 가능성을 부드럽게 받아주는 답장이 적절합니다." };
  }
  if (emotions.has("curiosity") || emotions.has("routine_check")) {
    return { style: "ask_back", reason: "상대의 관심에 일상 공유와 되묻기로 응답하면 대화가 자연스럽게 이어집니다." };
  }
  if (emotions.has("disappointment") && input.senderRole === "parent") {
    return { style: "give_space", reason: "서운함의 가능성이 있을 때는 캐묻기보다 여지를 남기는 편이 좋습니다." };
  }
  return { style: "share_daily_detail", reason: "큰 감정 신호가 강하지 않아 짧은 일상 공유가 대화를 이어가기 좋습니다." };
}

function caution(confidence: ConfidenceLevel) {
  if (confidence === "low") {
    return "메시지만으로는 단정하기 어렵습니다. 최근 대화 흐름과 평소 말투를 함께 확인해야 합니다.";
  }
  if (confidence === "medium") {
    return "가능성 중심의 해석입니다. 같은 표현도 관계 리듬과 최근 상황에 따라 다르게 받아들여질 수 있습니다.";
  }
  return "맥락 정보가 비교적 충분하지만, 감정을 확정하지 않고 가능한 정서 신호로만 참고해야 합니다.";
}

export function analyzeEmotionContextMock(
  input: EmotionContextAnalysisInput
): EmotionContextAnalysisResult {
  const contextFactors = analyzeFactors(input);
  const possibleSignals = extractSignals(input, contextFactors);
  const confidence = determineConfidence(input, possibleSignals);
  const recommendedStrategy = determineStrategy(input, possibleSignals);
  const accommodationLevel = analyzeAccommodationLevel(input);
  const partialAnalysis = { recommendedStrategy, possibleSignals };

  return {
    confidence,
    surfaceMeaning: surfaceMeaning(input),
    possibleSignals,
    contextFactors,
    caution: caution(confidence),
    recommendedStrategy,
    suggestedReplies: generateReplyOptions(input, partialAnalysis),
    internalMetrics: {
      granularityScore: granularityScore(possibleSignals, contextFactors),
      accommodationLevel,
      messageLengthScore: messageLengthScore(input.messageText),
      contextRichnessScore: contextRichnessScore(input),
    },
  };
}

