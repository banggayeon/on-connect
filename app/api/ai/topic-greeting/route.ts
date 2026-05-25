import { NextRequest, NextResponse } from "next/server";
import { getWeatherContext } from "@/lib/weather/getWeatherContext";
import { demoDataset } from "@/lib/mockData";
import { getTimeOfDay } from "@/lib/ai/checkInGenerator";

function weatherEmoji(condition: string): string {
  if (condition === "맑음") return "☀️";
  if (condition === "대체로 맑음") return "🌤";
  if (condition.includes("소나기")) return "🌦";
  if (condition.includes("비") || condition.includes("가랑비")) return "🌧";
  if (condition.includes("눈")) return "🌨";
  if (condition.includes("뇌우")) return "⛈";
  if (condition.includes("안개")) return "🌫";
  return "⛅";
}

function generateMessage(
  topic: string,
  parentName: string,
  weather: { condition: string; temperature: number },
  timeOfDay: string,
  incomingMessage?: string,
): string {
  const { condition, temperature } = weather;
  const isNice = condition === "맑음" || condition === "대체로 맑음";
  const isRain = condition.includes("비") || condition.includes("소나기");
  const isSnow = condition.includes("눈");
  const isHot = temperature >= 28;
  const isCold = temperature <= 5;

  switch (topic) {
    case "날씨":
      if (isNice && !isHot && !isCold)
        return `${parentName}, 오늘 날씨가 ${temperature}°C에 맑아서 정말 좋죠? 저도 나가고 싶었는데, 산책 다녀오셨어요?`;
      if (isHot)
        return `${parentName}, 오늘 ${temperature}°C까지 올라간다고 하던데 더우시죠? 시원하게 잘 지내고 계세요?`;
      if (isCold)
        return `${parentName}, 오늘 ${temperature}°C라고 하던데 많이 춥죠? 따뜻하게 입고 계세요? 감기 조심하세요.`;
      if (isRain)
        return `${parentName}, 오늘 비 오는데 우산 챙기셨어요? 습하고 쌀쌀하던데 몸 따뜻하게 하세요.`;
      if (isSnow)
        return `${parentName}, 오늘 눈 온다고 하던데 보셨어요? 미끄러우니까 외출하실 때 꼭 조심하세요.`;
      return `${parentName}, 오늘 날씨가 ${condition}이에요. 잘 지내고 계시죠?`;

    case "산책":
      if (isNice && !isHot)
        return `${parentName}, 오늘 날씨가 ${temperature}°C에 맑아서 산책하기 딱 좋을 것 같아요. 오늘 나가보셨어요? 저도 퇴근하고 좀 걸어볼까 해요.`;
      if (isRain)
        return `${parentName}, 오늘은 비가 와서 산책은 쉬어야겠네요. 실내에서 편하게 쉬고 계세요? 비 그치면 같이 걸어요.`;
      return `${parentName}, 요즘도 산책 자주 다니세요? 저도 요즘 짧게라도 걸으려고 하고 있어요.`;

    case "식사": {
      const meal = timeOfDay === "morning" ? "아침" : timeOfDay === "afternoon" ? "점심" : "저녁";
      return `${parentName}, ${meal}은 잘 챙겨 드셨어요? 오늘 뭐 드셨는지 궁금해서요. 저도 방금 먹었는데 맛있었어요.`;
    }

    case "사진":
      return `${parentName}, 요즘 사진 찍으신 거 있으세요? 요즘 예쁜 것들을 지나치기가 아까워서요. 사진 한 장 보내주세요!`;

    case "요즘":
      return `${parentName}, 요즘 어떻게 지내세요? 바쁘게 지내다 보니 자주 연락을 못 드렸어요. 잘 지내고 계시죠?`;

    case "답장":
      if (incomingMessage) {
        return `잘 지내고 있어요! 요즘 좀 바빠서 연락이 늦었는데 밥은 잘 챙겨 먹고 있어요. ${parentName}도 식사 따뜻하게 챙기세요.`;
      }
      return `${parentName}, 잘 지내고 계세요? 저는 잘 지내고 있어요. 조만간 연락드릴게요.`;

    default:
      return `${parentName}, 오늘 하루 어떻게 보내셨어요? 잘 지내고 계시죠?`;
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* empty */ }

  const topic = typeof body.topic === "string" ? body.topic : "요즘";
  const parentId = typeof body.parentId === "string" ? body.parentId : "parent_mother";
  const incomingMessage = typeof body.incomingMessage === "string" ? body.incomingMessage : undefined;

  const parent = demoDataset.parents.find((p) => p.id === parentId) ?? demoDataset.parents[0];
  const weather = await getWeatherContext();
  const timeOfDay = getTimeOfDay();
  const weatherArg = { condition: weather.condition, temperature: weather.temperature ?? 20 };
  const message = generateMessage(topic, parent.displayName, weatherArg, timeOfDay, incomingMessage);

  return NextResponse.json({ message, weather, topic });
}
