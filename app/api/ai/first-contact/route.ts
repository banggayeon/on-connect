import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { demoDataset } from "@/lib/mockData";

type Suggestion = { id: string; text: string; reason: string };

function buildPrompt(
  name: string,
  relationshipType: string,
  daysSince: number,
  interests: string[],
  memoContext: string
): string {
  const toneHint = relationshipType === "friend" ? "친구 사이 반말" : "존댓말";
  const relationLabel =
    relationshipType === "family" ? "가족" :
    relationshipType === "friend" ? "친구" : "지인";

  return `당신은 사용자가 오래 연락 못한 사람에게 부담 없는 첫 안부 문장을 건넬 수 있도록 돕는 어시스턴트입니다.

상대방:
- 이름: ${name}
- 관계: ${relationLabel}
- 마지막 연락: ${daysSince}일 전
- 관심사: ${interests.join(", ")}
- 말투: ${toneHint}

최근 대화 맥락:
${memoContext}

위 맥락을 이용해 첫 안부 문장 3개를 만들어주세요.

규칙:
- 카카오톡에 바로 보낼 수 있는 자연스러운 말투
- 각 30자 내외로 짧고 가볍게
- "AI가", "분석하면", "관계 온도" 같은 표현 절대 사용 금지
- 3가지 접근: ① 최근 메모 이어받기 ② 가벼운 안부 ③ 관심사 활용
- ${daysSince}일이 길수록 "오랜만이에요" 포함

JSON만 출력 (설명 없이):
[{"id":"1","text":"...","reason":"10자 이내 이유"},{"id":"2","text":"...","reason":"..."},{"id":"3","text":"...","reason":"..."}]`;
}

function getFallback(name: string, daysSince: number, relationshipType: string): Suggestion[] {
  const isFriend = relationshipType === "friend";
  if (daysSince >= 90) {
    return [
      { id: "f1", text: isFriend ? `${name}아, 오랜만이야. 잘 지내?` : `${name}, 오랜만이에요. 잘 지내고 계세요?`, reason: "솔직한 첫마디" },
      { id: "f2", text: isFriend ? "갑자기 생각나서 연락해봤어" : "갑자기 생각이 나서 연락드려요", reason: "자연스러운 시작" },
      { id: "f3", text: isFriend ? "요즘 어떻게 지내?" : "요즘 어떻게 지내세요?", reason: "부담 없는 안부" },
    ];
  }
  return [
    { id: "f1", text: isFriend ? `${name}아, 요즘 어때?` : `${name}, 요즘 어떻게 지내세요?`, reason: "가벼운 안부" },
    { id: "f2", text: isFriend ? "오랜만에 연락해봤어" : "오랜만에 연락드려요", reason: "자연스러운 시작" },
    { id: "f3", text: isFriend ? "잘 지내고 있지?" : "잘 지내고 계시죠?", reason: "부담 없는 확인" },
  ];
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}

  const personId = typeof body.personId === "string" ? body.personId : "parent_mother";
  const daysSince = typeof body.daysSince === "number" ? body.daysSince : 14;

  const person = demoDataset.parents.find(p => p.id === personId) ?? demoDataset.parents[0];
  const { displayName, preferenceProfile, conversationMemos, relationshipType } = person;
  const relType = relationshipType ?? "family";

  const memoContext = conversationMemos.length > 0
    ? conversationMemos
        .slice(0, 3)
        .map(m => `- ${m.title}: ${m.suggestedFollowUp}`)
        .join("\n")
    : "최근 대화 메모 없음";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: getFallback(displayName, daysSince, relType) });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: buildPrompt(displayName, relType, daysSince, preferenceProfile.interests, memoContext)
      }]
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "[]";
    const match = raw.match(/\[[\s\S]*?\]/);
    const suggestions: Suggestion[] = match ? JSON.parse(match[0]) : getFallback(displayName, daysSince, relType);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: getFallback(displayName, daysSince, relType) });
  }
}
