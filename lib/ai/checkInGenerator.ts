import type { CheckInSuggestion, WeatherContext } from "@/lib/types";

type GenerateContext = {
  recipientName: string;
  recipientRole: string;
  interests: string[];
  avoidedTopics: string[];
  recentTopics: string[];
  weather: WeatherContext;
  timeOfDay: "morning" | "afternoon" | "evening";
  daysSinceContact: number;
};

function makeId(prefix: string, i: number) {
  return `${prefix}-${i}-${Date.now()}`;
}

const MEAL_TIMES: Record<string, string> = {
  morning: "아침",
  afternoon: "점심",
  evening: "저녁",
};

// ── All possible suggestion templates ──────────────────────────────────────

function weatherSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName, weather } = ctx;
  return {
    id: makeId("weather", i),
    category: "weather",
    title: "날씨로 가볍게 시작하기",
    message: `${recipientName}, 오늘 날씨 괜찮던데 산책 다녀오셨어요?`,
    reason: weather.checkInHint,
    tone: "casual",
    contextTags: ["날씨", "산책", "가벼운 안부"],
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function mealSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName, timeOfDay } = ctx;
  const mealKo = MEAL_TIMES[timeOfDay] ?? "식사";
  return {
    id: makeId("routine", i),
    category: "routine",
    title: "식사 안부 묻기",
    message: `${mealKo}은 잘 챙겨 드셨어요? 오늘은 뭐 드셨는지 궁금해요.`,
    reason: "식사 이야기는 부모님이 답하기 쉬운 주제예요.",
    tone: "gentle",
    contextTags: ["식사", "일상", "답하기 쉬움"],
    bestTimeLabel: `${mealKo} 전후`,
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function memorySuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName, recentTopics } = ctx;
  const topic = recentTopics[0] ?? "산책길";
  const topicKo: Record<string, string> = {
    walk: "산책길", hiking: "등산로", meal: "드시던 반찬",
    plants: "화분", food: "반찬", baseball: "야구",
  };
  const topicLabel = topicKo[topic] ?? topic;
  return {
    id: makeId("memory", i),
    category: "memory",
    title: "최근 대화 이어가기",
    message: `지난번에 말씀하신 ${topicLabel}은 요즘도 자주 가세요?`,
    reason: "최근 대화에서 나온 주제를 이어가면 자연스러워요.",
    tone: "warm",
    contextTags: ["최근 대화", "이어가기", "부담 없음"],
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function morningGreetingSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName } = ctx;
  return {
    id: makeId("light", i),
    category: "light",
    title: "아침 인사 건네기",
    message: `${recipientName}, 오늘 하루도 편안히 보내세요.`,
    reason: "아침에 짧게 건네는 인사는 마음이 잘 전달돼요.",
    tone: "warm",
    contextTags: ["아침", "짧은 인사", "따뜻한 시작"],
    bestTimeLabel: "오전",
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function eveningCareSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName } = ctx;
  return {
    id: makeId("care", i),
    category: "care",
    title: "저녁 안부 묻기",
    message: `오늘 하루 어떠셨어요? 저도 방금 퇴근했어요.`,
    reason: "저녁에는 하루 이야기를 나누기 좋아요.",
    tone: "casual",
    contextTags: ["저녁", "하루 마무리", "대화 열기"],
    bestTimeLabel: "저녁",
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function reconnectSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName, daysSinceContact } = ctx;
  return {
    id: makeId("light", i),
    category: "light",
    title: "오랜만에 가볍게 인사",
    message: `${recipientName}, 요즘 어떻게 지내세요? 잘 지내고 계시죠?`,
    reason: `마지막 연락이 ${daysSinceContact}일 전이에요. 부담 없이 안부를 건네보세요.`,
    tone: "gentle",
    contextTags: ["안부", "가볍게", "부담 없음"],
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

function interestSuggestion(ctx: GenerateContext, i: number): CheckInSuggestion {
  const { recipientName, interests } = ctx;
  const interest = interests[0] ?? "요즘 지내시는 것";
  const interestKo: Record<string, string> = {
    "산책": "산책", "날씨": "날씨", "반찬": "반찬 만들기",
    "드라마": "요즘 드라마", "등산": "등산", "야구": "야구 경기",
  };
  const interestLabel = interestKo[interest] ?? interest;
  return {
    id: makeId("care", i),
    category: "care",
    title: `${interestLabel} 이야기 꺼내기`,
    message: `${interestLabel} 요즘도 즐기고 계세요?`,
    reason: `${recipientName}이 좋아하시는 주제라서 대화가 자연스럽게 이어져요.`,
    tone: "casual",
    contextTags: [interestLabel, "관심사", "가벼운 대화"],
    recipientName,
    recipientRole: ctx.recipientRole,
  };
}

// ── Main generator ──────────────────────────────────────────────────────────

export function generateCheckInSuggestions(ctx: GenerateContext): CheckInSuggestion[] {
  const { timeOfDay, daysSinceContact, weather } = ctx;

  // Build a pool of all possible suggestions
  const pool: CheckInSuggestion[] = [
    mealSuggestion(ctx, 0),
    memorySuggestion(ctx, 1),
  ];

  if (weather.condition === "맑음") {
    pool.unshift(weatherSuggestion(ctx, 2));
  }
  if (daysSinceContact >= 5) {
    pool.unshift(reconnectSuggestion(ctx, 3));
  }
  if (timeOfDay === "morning") {
    pool.push(morningGreetingSuggestion(ctx, 4));
  }
  if (timeOfDay === "evening") {
    pool.push(eveningCareSuggestion(ctx, 5));
  }
  if (ctx.interests.length > 0) {
    pool.push(interestSuggestion(ctx, 6));
  }

  // Deduplicate by category and return top 3
  const seen = new Set<string>();
  const result: CheckInSuggestion[] = [];
  for (const s of pool) {
    if (!seen.has(s.category) && result.length < 3) {
      seen.add(s.category);
      result.push(s);
    }
  }
  // Pad with fallbacks if needed
  if (result.length < 3) {
    result.push(mealSuggestion(ctx, result.length + 10));
  }
  if (result.length < 3) {
    result.push(reconnectSuggestion(ctx, result.length + 10));
  }

  return result.slice(0, 3);
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export function getMockMotherSuggestions(): CheckInSuggestion[] {
  return generateCheckInSuggestions({
    recipientName: "엄마",
    recipientRole: "mother",
    interests: ["산책", "날씨", "반찬", "드라마"],
    avoidedTopics: ["건강을 캐묻는 질문", "돈 이야기"],
    recentTopics: ["walk", "meal", "plants"],
    weather: { condition: "맑음", temperature: 22, summary: "오늘은 산책하기 좋은 날씨예요.", checkInHint: "오늘 날씨가 좋아서 산책 이야기를 꺼내기 좋아요." },
    timeOfDay: getTimeOfDay(),
    daysSinceContact: 9,
  });
}

export function getMockFatherSuggestions(): CheckInSuggestion[] {
  return generateCheckInSuggestions({
    recipientName: "아빠",
    recipientRole: "father",
    interests: ["등산", "야구", "산책"],
    avoidedTopics: ["재정 이야기", "건강 걱정"],
    recentTopics: ["hiking", "baseball", "walk"],
    weather: { condition: "맑음", temperature: 22, summary: "오늘은 산책하기 좋은 날씨예요.", checkInHint: "오늘 날씨가 좋아서 산책 이야기를 꺼내기 좋아요." },
    timeOfDay: getTimeOfDay(),
    daysSinceContact: 9,
  });
}
