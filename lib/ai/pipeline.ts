import { NextResponse } from "next/server";
import { buildPromptForTask } from "@/lib/ai/prompts";
import { generateMockAiResponse } from "@/lib/ai/mockAiResponses";
import { demoDataset } from "@/lib/demoDataset";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import type { AiMockRequest, AiMockTask, DemoFamilyDataset, DemoParentProfile } from "@/lib/types";

const DEFAULT_REFERENCE_DATE = "2026-05-16";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function normalizeRequest(input: unknown, task: AiMockTask): Required<Pick<AiMockRequest, "userId" | "parentId" | "referenceDate">> & AiMockRequest {
  const body = isRecord(input) ? input : {};
  const defaultParentId = task === "warm-reply" && getString(body.rawMessage)?.includes("아빠") ? "parent_father" : "parent_mother";

  return {
    userId: getString(body.userId) ?? demoDataset.child.id,
    parentId: getString(body.parentId) ?? defaultParentId,
    referenceDate: getString(body.referenceDate) ?? demoDataset.generatedAt ?? DEFAULT_REFERENCE_DATE,
    currentSituation: getString(body.currentSituation),
    rawMessage: getString(body.rawMessage)
  };
}

function getParent(dataset: DemoFamilyDataset, parentId: string) {
  return dataset.parents.find((parent) => parent.id === parentId) ?? dataset.parents[0];
}

function buildResponse(task: AiMockTask, request: Required<Pick<AiMockRequest, "userId" | "parentId" | "referenceDate">> & AiMockRequest, parent: DemoParentProfile, fallback: boolean) {
  const relationship = calculateRelationshipTemperature(parent.id, demoDataset, request.referenceDate);
  const context = {
    task,
    request: {
      ...request,
      parentId: parent.id
    },
    parent,
    relationship
  };
  const prompt = buildPromptForTask(context);

  return generateMockAiResponse({
    ...context,
    prompt,
    fallback
  });
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function handleAiMockPost(task: AiMockTask, request: Request) {
  try {
    const body = await readJson(request);
    const normalizedRequest = normalizeRequest(body, task);
    const parent = getParent(demoDataset, normalizedRequest.parentId);

    return NextResponse.json(buildResponse(task, normalizedRequest, parent, false));
  } catch {
    const fallbackRequest = normalizeRequest({}, task);
    const parent = getParent(demoDataset, fallbackRequest.parentId);

    return NextResponse.json(buildResponse(task, fallbackRequest, parent, true));
  }
}
