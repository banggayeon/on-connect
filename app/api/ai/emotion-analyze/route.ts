import { NextRequest, NextResponse } from "next/server";
import { analyzeEmotionMock } from "@/lib/ai/emotionAnalyzer";
import type { EmotionAnalysisRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: { request?: EmotionAnalysisRequest; prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const useRealAI = process.env.USE_REAL_AI === "true";

  if (!useRealAI || !body.prompt) {
    const request = body.request;
    if (!request?.messageText || !request?.senderRole || !request?.receiverRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = analyzeEmotionMock(request);
    return NextResponse.json(result);
  }

  // real 모드: LLM이 possibleSignals/contextFactors/caution/recommendedStrategy를 반환
  // suggestedReplies와 _internal은 서버에서 mock 로직으로 채움
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    const llmResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{ role: "user", content: body.prompt }],
      }),
    });

    const llmData = await llmResponse.json();
    const text: string = llmData.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const llmResult = JSON.parse(clean);

    // suggestedReplies와 _internal은 mock 로직으로 보완
    const mockFull = analyzeEmotionMock(body.request!);
    const merged = {
      ...mockFull,
      confidence: llmResult.confidence ?? mockFull.confidence,
      surfaceMeaning: llmResult.surfaceMeaning ?? mockFull.surfaceMeaning,
      possibleSignals: llmResult.possibleSignals ?? mockFull.possibleSignals,
      contextFactors: llmResult.contextFactors ?? mockFull.contextFactors,
      caution: llmResult.caution ?? mockFull.caution,
      recommendedStrategy: llmResult.recommendedStrategy ?? mockFull.recommendedStrategy,
    };
    return NextResponse.json(merged);
  } catch (error) {
    console.error("LLM API 호출 실패, mock으로 fallback:", error);
    const result = analyzeEmotionMock(body.request!);
    return NextResponse.json(result);
  }
}
