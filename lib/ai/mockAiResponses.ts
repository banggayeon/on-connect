import type { AiMockRequest, AiMockResponse, AiMockTask, DemoParentProfile, RelationshipTemperatureResult } from "@/lib/types";
import type { AiPrompt } from "@/lib/ai/prompts";

type MockResponseContext = {
  task: AiMockTask;
  request: Required<Pick<AiMockRequest, "userId" | "parentId" | "referenceDate">> & AiMockRequest;
  parent: DemoParentProfile;
  relationship: RelationshipTemperatureResult;
  prompt: AiPrompt;
  fallback: boolean;
};

function getCreatedAt(referenceDate: string) {
  return `${referenceDate}T12:00:00+09:00`;
}

function getLatestMemo(parent: DemoParentProfile) {
  return parent.conversationMemos[0];
}

function getPrimarySignal(parent: DemoParentProfile) {
  return parent.careSignals[0];
}

function getPreferredWindow(parent: DemoParentProfile) {
  return parent.preferenceProfile.preferredContactWindows[0];
}

function makeBaseResponse(context: MockResponseContext, fields: Pick<AiMockResponse, "summary" | "recommendedMessage" | "evidence" | "reasoning">): AiMockResponse {
  return {
    task: context.task,
    userId: context.request.userId,
    parentId: context.parent.id,
    ...fields,
    createdAt: getCreatedAt(context.request.referenceDate),
    meta: {
      mode: "mock",
      promptTemplateId: context.prompt.id,
      fallback: context.fallback
    }
  };
}

function softenMessage(rawMessage: string | undefined, parent: DemoParentProfile) {
  const baseMessage = rawMessage?.trim() || parent.agentSeedSummary.warmReplyAI.incomingMessage;

  if (parent.role === "father") {
    if (baseMessage.includes("사진") || baseMessage.includes("등산")) {
      return "사진 좋네요. 주말엔 무릎 무리 안 가게 짧게 같이 걸어요.";
    }

    return `${baseMessage.replace(/[!?]+$/g, "")}. 아빠도 무리하지 말고 쉬세요.`;
  }

  if (baseMessage.includes("왜") || baseMessage.includes("또")) {
    return "걱정해줘서 고마워요. 오늘은 잘 챙겨 먹었고 엄마도 식사 꼭 챙기세요.";
  }

  if (baseMessage.includes("밥") || baseMessage.includes("저녁") || baseMessage.includes("먹")) {
    return "잘 먹었어요. 엄마도 저녁 따뜻하게 챙겨 드세요.";
  }

  return `${baseMessage.replace(/[!?]+$/g, "")}. 고마워요, 엄마도 오늘 편히 쉬세요.`;
}

export function generateBriefingResponse(context: MockResponseContext) {
  const briefing = context.parent.agentSeedSummary.parentBriefing;
  const signal = getPrimarySignal(context.parent);
  const window = getPreferredWindow(context.parent);

  return makeBaseResponse(context, {
    summary: briefing.title,
    recommendedMessage: briefing.recommendedAction,
    evidence: [
      context.relationship.reasons[0],
      signal.evidence,
      `${window.label}: ${window.reason}`
    ],
    reasoning: `${context.parent.displayName}의 최근 관계 온도는 ${context.relationship.temperature}도(${context.relationship.label})입니다. ${briefing.summary}`
  });
}

export function generateWarmReplyResponse(context: MockResponseContext) {
  const warmReply = context.parent.agentSeedSummary.warmReplyAI;

  return makeBaseResponse(context, {
    summary: `${context.parent.displayName}에게 부담이 적은 말투로 답장을 다듬었어요.`,
    recommendedMessage: softenMessage(context.request.rawMessage, context.parent),
    evidence: [
      `선호 말투: ${context.parent.preferenceProfile.tonePreferences.join(", ")}`,
      `입력 문장: ${context.request.rawMessage ?? warmReply.incomingMessage}`,
      warmReply.reason
    ],
    reasoning: `${warmReply.intent}에 맞춰 길이를 줄이고, 안심되는 표현을 앞에 배치했습니다.`
  });
}

export function generateCareActionResponse(context: MockResponseContext) {
  const careAction = context.parent.agentSeedSummary.careAction;
  const signal = getPrimarySignal(context.parent);
  const memo = getLatestMemo(context.parent);

  return makeBaseResponse(context, {
    summary: careAction.title,
    recommendedMessage: careAction.body,
    evidence: [
      signal.title,
      signal.evidence,
      memo ? memo.suggestedFollowUp : "최근 대화 메모가 충분하지 않아 기본 케어 액션을 사용했어요."
    ],
    reasoning: `${context.parent.displayName}에게는 ${context.parent.preferenceProfile.avoidedTopics.join(", ")}를 피하고, 오늘 바로 실행 가능한 낮은 부담의 행동이 적합합니다.`
  });
}

export function generateReportResponse(context: MockResponseContext) {
  const topGift = context.parent.giftCandidates[0];
  const signals = context.parent.careSignals.slice(0, 2);

  return makeBaseResponse(context, {
    summary: `${context.parent.displayName} 리포트: 관계 온도 ${context.relationship.temperature}도, ${context.relationship.label}`,
    recommendedMessage: `${context.parent.agentSeedSummary.parentBriefing.recommendedAction} 선물은 '${topGift.name}'보다 먼저 '${topGift.careActionPairing}' 흐름으로 연결해보세요.`,
    evidence: [
      ...context.relationship.reasons.slice(0, 3),
      ...signals.map((signal) => `${signal.title}: ${signal.evidence}`),
      `선물 후보: ${topGift.name}(${topGift.priceRange})`
    ],
    reasoning: "관계 온도 계산 결과, 최근 대화 메모, 케어 시그널, 선물 후보를 한 화면 리포트에 맞게 압축했습니다."
  });
}

export function generateMockAiResponse(context: MockResponseContext) {
  if (context.task === "briefing") {
    return generateBriefingResponse(context);
  }

  if (context.task === "warm-reply") {
    return generateWarmReplyResponse(context);
  }

  if (context.task === "care-action") {
    return generateCareActionResponse(context);
  }

  return generateReportResponse(context);
}
