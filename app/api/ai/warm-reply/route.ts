import { NextRequest, NextResponse } from "next/server";
import { analyzeEmotionMock } from "@/lib/ai/emotionAnalyzer";
import { handleAiMockPost } from "@/lib/ai/pipeline";
import type { EmotionAnalysisRequest } from "@/lib/types";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await (request as NextRequest).json();
  } catch {
    body = {};
  }

  const rawMessage = typeof body.rawMessage === "string" ? body.rawMessage : undefined;
  const senderName = typeof body.senderName === "string" ? body.senderName : undefined;

  // rawMessage가 있으면 EmotionContextAnalysisResult 형태로 반환
  if (rawMessage) {
    const emotionRequest: EmotionAnalysisRequest = {
      messageText: rawMessage,
      senderRole: "parent",
      senderName,
      receiverRole: "child",
    };
    const result = analyzeEmotionMock(emotionRequest);
    return NextResponse.json(result);
  }

  // 기존 파이프라인 호환 (rawMessage 없는 경우)
  return handleAiMockPost("warm-reply", request);
}
