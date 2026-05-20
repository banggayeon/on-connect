import type { AiMockRequest, AiMockTask, DemoParentProfile, RelationshipTemperatureResult } from "@/lib/types";

type PromptContext = {
  task: AiMockTask;
  request: Required<Pick<AiMockRequest, "userId" | "parentId" | "referenceDate">> & AiMockRequest;
  parent: DemoParentProfile;
  relationship: RelationshipTemperatureResult;
};

export type AiPrompt = {
  id: string;
  task: AiMockTask;
  system: string;
  user: string;
};

function getParentContext(parent: DemoParentProfile) {
  return [
    `대상: ${parent.displayName}(${parent.age}세)`,
    `관심사: ${parent.preferenceProfile.interests.join(", ")}`,
    `선호 말투: ${parent.preferenceProfile.tonePreferences.join(", ")}`,
    `피해야 할 주제: ${parent.preferenceProfile.avoidedTopics.join(", ")}`,
    `동의된 정보: ${parent.preferenceProfile.consentSettings.filter((setting) => setting.enabled).map((setting) => setting.label).join(", ")}`
  ].join("\n");
}

function getRelationshipContext(relationship: RelationshipTemperatureResult) {
  return [
    `관계 온도: ${relationship.temperature}도`,
    `라벨: ${relationship.label}`,
    `변화량: ${relationship.delta}`,
    `근거: ${relationship.reasons.join(" / ")}`
  ].join("\n");
}

function buildBasePrompt(id: string, task: AiMockTask, context: PromptContext, instruction: string): AiPrompt {
  return {
    id,
    task,
    system: "온 커넥트 AI Family Relationship Agent 데모용 mock prompt입니다. 실제 LLM 호출 없이 같은 입력에는 같은 JSON 결과를 생성합니다.",
    user: [
      instruction,
      getParentContext(context.parent),
      getRelationshipContext(context.relationship),
      `현재 상황: ${context.request.currentSituation ?? "별도 상황 없음"}`,
      `원문 메시지: ${context.request.rawMessage ?? "없음"}`,
      "출력 필드는 summary, recommendedMessage, evidence, reasoning, createdAt을 유지합니다."
    ].join("\n\n")
  };
}

export function buildBriefingPrompt(context: PromptContext) {
  return buildBasePrompt(
    "family-agent.briefing.v1",
    "briefing",
    context,
    "부모님의 최근 연락 흐름과 동의된 신호를 바탕으로 오늘의 Parent Briefing을 만듭니다."
  );
}

export function buildWarmReplyPrompt(context: PromptContext) {
  return buildBasePrompt(
    "family-agent.warm-reply.v1",
    "warm-reply",
    context,
    "자녀가 보낼 답장을 부모님의 말투 선호에 맞춰 더 부드럽게 다듬습니다."
  );
}

export function buildCareActionPrompt(context: PromptContext) {
  return buildBasePrompt(
    "family-agent.care-action.v1",
    "care-action",
    context,
    "부모님의 케어 시그널과 최근 대화 메모를 바탕으로 오늘 실행할 수 있는 케어 액션을 추천합니다."
  );
}

export function buildReportPrompt(context: PromptContext) {
  return buildBasePrompt(
    "family-agent.report.v1",
    "report",
    context,
    "관계 온도, 연락 패턴, 케어 시그널, 선물 후보를 한 번에 요약한 데모 리포트를 만듭니다."
  );
}

export function buildPromptForTask(context: PromptContext) {
  if (context.task === "briefing") {
    return buildBriefingPrompt(context);
  }

  if (context.task === "warm-reply") {
    return buildWarmReplyPrompt(context);
  }

  if (context.task === "care-action") {
    return buildCareActionPrompt(context);
  }

  return buildReportPrompt(context);
}
