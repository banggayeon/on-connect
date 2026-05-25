import { NextRequest, NextResponse } from "next/server";
import type { ReplySuggestion } from "@/lib/types";

function generateReplySuggestions(receivedMessage: string, senderName: string): ReplySuggestion[] {
  const isQuestion = receivedMessage.includes("?") || receivedMessage.includes("어때") || receivedMessage.includes("어요");
  const isShort = receivedMessage.length < 20;

  const short: ReplySuggestion = {
    id: `reply-short-${Date.now()}`,
    text: isQuestion ? "응, 잘 지내~ 거기는 어때?" : "잘 받았어요 😊",
    tone: "short",
    label: "짧게",
  };

  const warm: ReplySuggestion = {
    id: `reply-warm-${Date.now() + 1}`,
    text: isShort
      ? `${senderName}, 연락해줘서 좋아요. 저도 잘 지내고 있어요!`
      : `${senderName}, 메시지 받고 기분이 좋아졌어요. 저도 잘 지내고 있어요 😊`,
    tone: "warm",
    label: "따뜻하게",
  };

  const reassuring: ReplySuggestion = {
    id: `reply-reassuring-${Date.now() + 2}`,
    text: `걱정 마세요, 잘 있어요. ${senderName}도 건강하게 지내세요!`,
    tone: "reassuring",
    label: "안심시키기",
  };

  return [short, warm, reassuring];
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const receivedMessage = typeof body.receivedMessage === "string" ? body.receivedMessage : "안부 문자";
  const senderName = typeof body.senderName === "string" ? body.senderName : "자녀";

  const suggestions = generateReplySuggestions(receivedMessage, senderName);

  return NextResponse.json({ suggestions });
}
