import { demoDataset, demoFather, demoMother } from "@/lib/demoDataset";

const child = demoDataset.child;
const mother = demoMother;
const father = demoFather;
const motherBirthday = mother.preferenceProfile.birthday;

export { demoDataset, demoFather, demoMother };

export const childProfile = {
  id: child.id,
  name: child.name,
  displayName: child.displayName,
  familyNickname: child.familyNickname,
  role: child.role,
  age: child.age
};

export const parentProfile = {
  id: mother.id,
  name: mother.displayName,
  displayName: mother.displayName,
  role: "parent",
  relationshipLabel: mother.relationLabel,
  birthday: {
    label: motherBirthday.label,
    dateText: `${motherBirthday.month}월 ${motherBirthday.day}일`,
    dDay: "D+6"
  },
  accessibility: {
    largeText: true
  }
};

export const fatherProfile = {
  id: father.id,
  name: father.displayName,
  displayName: father.displayName,
  role: "parent",
  relationshipLabel: father.relationLabel,
  birthday: {
    label: father.preferenceProfile.birthday.label,
    dateText: `${father.preferenceProfile.birthday.month}월 ${father.preferenceProfile.birthday.day}일`,
    dDay: "D-170"
  },
  accessibility: {
    largeText: true
  }
};

export const relationshipTemperature = {
  id: "temp_mother_mingwon",
  targetParentId: parentProfile.id,
  label: parentProfile.relationshipLabel,
  valueText: `${mother.agentSeedSummary.relationshipTemperature.valueCelsius.toFixed(1)}°`,
  stateText: mother.agentSeedSummary.relationshipTemperature.stateLabel,
  deltaText: `+${mother.agentSeedSummary.relationshipTemperature.trendCelsius}°`,
  progressPercent: mother.agentSeedSummary.relationshipTemperature.progressPercent,
  note: "오늘은 저녁 식사 안부 하나면 충분해요."
};

export const fatherRelationshipTemperature = {
  id: "temp_father_mingwon",
  targetParentId: fatherProfile.id,
  label: fatherProfile.relationshipLabel,
  valueText: `${father.agentSeedSummary.relationshipTemperature.valueCelsius.toFixed(1)}°`,
  stateText: father.agentSeedSummary.relationshipTemperature.stateLabel,
  deltaText: `+${father.agentSeedSummary.relationshipTemperature.trendCelsius}°`,
  progressPercent: father.agentSeedSummary.relationshipTemperature.progressPercent,
  note: "사진에 짧게 반응하고 주말 산책을 제안해보세요."
};

export const recentSignals = [
  {
    id: "signal_mother_dinner",
    senderId: mother.id,
    senderName: mother.displayName,
    summary: mother.agentSeedSummary.warmReplyAI.incomingMessage,
    tone: "coral" as const,
    createdAtText: "최근"
  },
  {
    id: "signal_father_photo",
    senderId: father.id,
    senderName: father.displayName,
    summary: father.agentSeedSummary.warmReplyAI.incomingMessage,
    tone: "honey" as const,
    createdAtText: "최근"
  }
];

export const careBriefing = {
  id: "briefing_today",
  title: "AI 브리핑",
  headline: mother.agentSeedSummary.parentBriefing.title,
  body: "최근 허리 관련 표현이 반복되어, 건강보다 일상 안부로 자연스럽게 시작해보세요.",
  nextWarmActionTitle: "다음 따뜻한 일",
  nextWarmActionBody: "아빠는 등산 사진에 짧고 구체적으로 반응하면 좋아요."
};

export const todaysParentBriefing = {
  id: "parent_briefing_today",
  label: "Today’s Parent Briefing · AI 추천",
  title: mother.agentSeedSummary.parentBriefing.title,
  summary: mother.agentSeedSummary.parentBriefing.summary,
  recommendedActionLabel: "추천 케어 액션",
  recommendedAction: mother.agentSeedSummary.parentBriefing.recommendedAction,
  confidence: "관계 온도 기반 추천"
};

export const fatherParentBriefing = {
  id: "father_briefing_today",
  label: "Dad Briefing · AI 추천",
  title: father.agentSeedSummary.parentBriefing.title,
  summary: father.agentSeedSummary.parentBriefing.summary,
  recommendedActionLabel: "추천 케어 액션",
  recommendedAction: father.agentSeedSummary.parentBriefing.recommendedAction,
  confidence: "관계 온도 기반 추천"
};

export const contactStats = [
  {
    id: "mother_greeting",
    label: "엄마 안부",
    value: "어제",
    tone: "leaf" as const
  },
  {
    id: "father_photo",
    label: "아빠 사진",
    value: "오늘",
    tone: "sky" as const
  }
];

export const careMessages = {
  screen: {
    eyebrow: "시간 맞춤 안부",
    title: "저녁이에요",
    description: "엄마에게는 식사 안부, 아빠에게는 취미 반응이 자연스러워요."
  },
  parentPromptTitle: "부모님께 보낼 안부",
  suggestions: [
    {
      id: "mom_evening_meal",
      text: "엄마, 오늘 저녁은 뭐 드셨어요?",
      helper: "식사 이야기로 시작하는 부담 없는 안부",
      tone: "coral" as const,
      active: true
    },
    {
      id: "mom_rest",
      text: "엄마, 오늘은 좀 쉬셨어요?",
      helper: "건강을 직접 캐묻지 않는 짧은 안부",
      tone: "coral" as const,
      active: false
    },
    {
      id: "dad_photo_reply",
      text: "아빠, 사진 멋져요. 주말엔 무리 안 가게 같이 걸어요.",
      helper: "아빠의 취미에 반응하는 짧은 안부",
      tone: "honey" as const,
      active: false
    }
  ],
  latestReply: {
    title: `✦ ${child.name}이가 보낸 답`,
    message: "잘 먹었어요!",
    timeAgo: "8분 전"
  },
  quickReplyTitle: "자녀의 한 번 응답",
  quickReplies: ["잘 먹었어요", "잘 챙겼어요", "고마워요, 엄마", "곧 전화드릴게요"],
  sendButtonLabel: "안부 보내기",
  weatherNotice: "오늘 서울은 저녁에 선선해서 산책 이야기도 자연스러워요.",
  warmReplyAI: {
    label: "Warm Reply AI · 추천 이유",
    title: "짧게 답해도 따뜻하게 느껴지는 문장을 골랐어요.",
    reason: mother.agentSeedSummary.warmReplyAI.reason,
    suggestedReply: mother.agentSeedSummary.warmReplyAI.suggestedReply,
    incomingMessage: mother.agentSeedSummary.warmReplyAI.incomingMessage
  },
  fatherWarmReplyAI: father.agentSeedSummary.warmReplyAI
};

export const careReport = {
  screen: {
    eyebrow: "부모님 케어",
    title: "엄마와 아빠의 하루",
    description: "안부, 건강 신호, 생활 리듬을 동의 기반으로 모아봤어요."
  },
  weeklyCheckinsTitle: "이번 주 안부",
  weeklyCheckins: [
    { day: "월", colorClass: "bg-leaf-500", status: "done" },
    { day: "화", colorClass: "bg-leaf-500", status: "done" },
    { day: "수", colorClass: "bg-coral-400", status: "attention" },
    { day: "목", colorClass: "bg-honey-400", status: "light" },
    { day: "금", colorClass: "bg-leaf-500", status: "done" },
    { day: "토", colorClass: "bg-honey-400", status: "light" },
    { day: "일", colorClass: "bg-cream-300", status: "upcoming" }
  ],
  healthAlert: {
    title: "건강 알림",
    statusText: "● 관찰",
    metrics: [
      { id: "mother_back", label: "엄마 허리", value: "3회 언급" },
      { id: "father_knee", label: "아빠 무릎", value: "1회 언급" }
    ]
  },
  warmAction: {
    title: "오늘의 따뜻한 일",
    headline: mother.agentSeedSummary.careAction.title,
    body: mother.agentSeedSummary.careAction.body
  },
  sleepRhythm: {
    title: "아빠 수면 리듬",
    body: "아빠는 최근 잠을 늦게 잔다고 말했어요. 긴 걱정보다 짧게 쉬라고 전하는 말투가 좋아요."
  },
  aiSignals: {
    label: "AI가 감지한 관계/생활 시그널",
    title: "엄마는 식사 안부, 아빠는 취미 반응에서 대화가 자연스럽게 이어져요.",
    items: [
      mother.careSignals[0].recommendationHint,
      father.careSignals[2].recommendationHint,
      "두 분 모두 위치 정보는 공유하지 않고, 직접 말한 관심사와 생활 신호만 사용해요."
    ]
  }
};

export const consentSharing = {
  title: "공유할 정보 선택",
  description: "온 커넥트는 부모님이 동의한 정서/생활 신호만 자녀에게 보여줘요.",
  childNoticeTitle: "부모님이 동의한 정보만 보여요",
  childNoticeBody: "위치 추적이나 실시간 감시는 하지 않아요. 부모님이 선택한 안부 시간, 관심사, 건강 메모처럼 관계를 돕는 신호만 공유됩니다.",
  manageButtonLabel: "공유 정보 관리",
  items: mother.preferenceProfile.consentSettings.map((setting) => ({
    id: setting.scope,
    label: setting.label,
    description: setting.description,
    enabled: setting.enabled
  }))
};

export const giftRecommendations = {
  screen: {
    eyebrow: "마음을 담아",
    title: "부모님께 드릴 선물",
    description: "다가오는 날과 최근 대화를 바탕으로 골랐어요."
  },
  occasion: parentProfile.birthday,
  sectionTitle: "맞춤 추천",
  items: [
    {
      id: mother.giftCandidates[0].id,
      name: mother.giftCandidates[0].name,
      meta: "건강 · 49,000원",
      badge: "엄마 추천 · 부담 낮음",
      gradientClass: "from-leaf-300 to-leaf-500",
      aiReason: mother.giftCandidates[0].reason,
      careAction: mother.giftCandidates[0].careActionPairing
    },
    {
      id: father.giftCandidates[0].id,
      name: father.giftCandidates[0].name,
      meta: "실용 · 24,000원",
      badge: "아빠 추천 · 오늘 주문 가능",
      gradientClass: "from-[#FFD9B8] to-honey-400",
      aiReason: father.giftCandidates[0].reason,
      careAction: father.giftCandidates[0].careActionPairing
    },
    {
      id: father.giftCandidates[1].id,
      name: father.giftCandidates[1].name,
      meta: "경험 · 60,000원",
      badge: "부자 외출 · 일정 확인 필요",
      gradientClass: "from-coral-300 to-coral-400",
      aiReason: father.giftCandidates[1].reason,
      careAction: father.giftCandidates[1].careActionPairing
    }
  ],
  recommendationReasonTitle: "이 선물을 추천한 이유",
  recommendationReason: mother.giftCandidates[0].reason,
  careActionTitle: "AI 추천 케어 액션",
  careActionSummary: "선물 자체보다 부모님별 말투와 관심사에 맞춘 안부 메시지를 함께 전달할 때 관계 온도가 더 자연스럽게 올라가요.",
  ctaLabel: "추천 선물 보기"
};

// ─── DailyQuestion ───────────────────────────────────────────────────────────

export interface DailyQuestion {
  id: string;
  question: string;
  category: "memory" | "value" | "daily" | "dream" | "relationship";
  date: string;
  childAnswer?: string;
  parentAnswer?: string;
}

export const mockDailyQuestions: DailyQuestion[] = [
  {
    id: "q1",
    question: "어릴 때 가장 기억에 남는 가족 여행이 있으신가요?",
    category: "memory",
    date: "2026-05-20",
    childAnswer: "제주도 갔을 때 오렌지 농장에서 따먹었던 거요!",
    parentAnswer: undefined
  },
  {
    id: "q2",
    question: "요즘 가장 맛있게 드신 음식은 무엇이었나요?",
    category: "daily",
    date: "2026-05-19",
    childAnswer: "회사 근처 돼지국밥이요.",
    parentAnswer: "어제 만든 잡채! 처음으로 잘 됐어."
  },
  {
    id: "q3",
    question: "어머니가 가장 행복했던 순간은 언제였나요?",
    category: "memory",
    date: "2026-05-18",
    childAnswer: "저는 취업했을 때요.",
    parentAnswer: "네가 처음 혼자 걸었을 때."
  },
  {
    id: "q4",
    question: "젊었을 때 꼭 해보고 싶었던 일이 있었나요?",
    category: "dream",
    date: "2026-05-17",
    childAnswer: undefined,
    parentAnswer: undefined
  },
  {
    id: "q5",
    question: "요즘 가장 기대되는 일이 있으신가요?",
    category: "daily",
    date: "2026-05-16",
    childAnswer: "이번 주 주말 친구들 모임이요.",
    parentAnswer: "다음 달에 꽃밭 구경 가는 거."
  },
  {
    id: "q6",
    question: "부모님께 꼭 전하고 싶은 말이 있나요?",
    category: "relationship",
    date: "2026-05-15",
    childAnswer: "항상 건강하게 오래오래 계세요.",
    parentAnswer: "고마워. 우리도 늘 응원해."
  },
  {
    id: "q7",
    question: "요즘 가장 즐거운 시간은 언제인가요?",
    category: "value",
    date: "2026-05-14",
    childAnswer: undefined,
    parentAnswer: "아침에 화분에 물 줄 때."
  }
];

// ─── CalendarEntry ────────────────────────────────────────────────────────────

export interface CalendarEntry {
  date: string;
  parentId: "parent_mother" | "parent_father";
  entries: Array<{
    sender: "child" | "parent";
    type: "text" | "photo";
    content: string;
    timestamp: string;
  }>;
}

export const mockCalendarEntries: CalendarEntry[] = [
  {
    date: "2026-05-16",
    parentId: "parent_mother",
    entries: [
      { sender: "parent", type: "text", content: "오늘 저녁 뭐 먹니?", timestamp: "2026-05-16T18:30:00" },
      { sender: "child", type: "text", content: "집에서 간단히 먹으려고요. 엄마는요?", timestamp: "2026-05-16T18:55:00" }
    ]
  },
  {
    date: "2026-05-15",
    parentId: "parent_mother",
    entries: [
      { sender: "child", type: "text", content: "퇴근하고 피곤해서 일찍 잘 것 같아요.", timestamp: "2026-05-15T20:10:00" }
    ]
  },
  {
    date: "2026-05-14",
    parentId: "parent_mother",
    entries: [
      { sender: "parent", type: "text", content: "저녁을 챙겨 먹었는지 물어봄.", timestamp: "2026-05-14T19:20:00" },
      { sender: "child", type: "text", content: "네, 잘 먹었어요!", timestamp: "2026-05-14T19:40:00" }
    ]
  },
  {
    date: "2026-05-16",
    parentId: "parent_father",
    entries: [
      { sender: "parent", type: "photo", content: "새 등산로 표지판 사진을 보냄.", timestamp: "2026-05-16T08:30:00" },
      { sender: "child", type: "text", content: "사진 좋은데요! 주말에 같이 걸어요.", timestamp: "2026-05-16T12:20:00" }
    ]
  },
  {
    date: "2026-05-15",
    parentId: "parent_father",
    entries: [
      { sender: "child", type: "text", content: "주말 산책 약속 조율", timestamp: "2026-05-15T14:00:00" }
    ]
  }
];

// ─── CareAction ───────────────────────────────────────────────────────────────

export type CareActionType = "call" | "message" | "visit" | "gift";

export interface CareAction {
  id: string;
  parentId: "parent_mother" | "parent_father";
  type: CareActionType;
  icon: string;
  title: string;
  reason: string;
  guide: string;
  recommendedTime?: string;
  relatedKeywords: string[];
  hasGiftOption: boolean;
  giftNote?: string;
}

export const mockCareActions: CareAction[] = [
  {
    id: "mom_evening_call",
    parentId: "parent_mother",
    type: "call",
    icon: "📞",
    title: "저녁 안부 전화 드리기",
    reason: "허리 이야기가 3주째 반복되고 있어요. 짧은 전화로 건강보다 일상 안부를 먼저 여쭤보는 게 자연스러워요.",
    guide: "\"엄마 오늘 저녁은 뭐 드셨어요?\" 처럼 식사 이야기로 시작하고, 편하게 이야기하시면 허리는 자연스럽게 물어보세요.",
    recommendedTime: "저녁 7시 30분~8시",
    relatedKeywords: ["허리", "저녁", "식사"],
    hasGiftOption: false
  },
  {
    id: "mom_warm_message",
    parentId: "parent_mother",
    type: "message",
    icon: "💬",
    title: "짧은 따뜻한 메시지 보내기",
    reason: "엄마는 짧고 따뜻한 메시지에 빠르게 반응하는 패턴이 있어요. 오늘 컨디션이 어떠신지 묻는 한 문장이면 충분해요.",
    guide: "\"엄마 오늘 날씨 좋죠? 산책하셨어요?\" 처럼 부담 없는 질문 하나로 시작해보세요.",
    recommendedTime: "오전 8시~9시",
    relatedKeywords: ["메시지", "안부", "날씨"],
    hasGiftOption: false
  },
  {
    id: "mom_lumbar_gift",
    parentId: "parent_mother",
    type: "gift",
    icon: "🎁",
    title: "허리 케어 아이템 선물",
    reason: "허리 통증이 반복 언급되고 생신 이후 건강 챙김 맥락이 있어 실용적인 케어 아이템이 자연스러워요.",
    guide: "바로 구매보다 \"엄마, 찜질팩 같은 거 쓰세요?\" 라고 먼저 물어보고 필요하다고 하시면 선물하는 게 더 자연스러워요.",
    relatedKeywords: ["허리", "찜질팩", "쿠션"],
    hasGiftOption: true,
    giftNote: "찜질팩 또는 허리 쿠션 추천"
  },
  {
    id: "dad_walk_plan",
    parentId: "parent_father",
    type: "visit",
    icon: "🚶",
    title: "짧은 산책 함께하기",
    reason: "아빠는 등산·산책 사진을 자주 보내고, 무릎이 뻐근하다고 하셔서 부담이 적은 짧은 코스 제안이 좋아요.",
    guide: "\"아빠, 주말에 동네 한 바퀴만 걸어요. 무릎에 부담 없는 코스로요.\" 처럼 짧고 구체적으로 제안해보세요.",
    recommendedTime: "주말 오전",
    relatedKeywords: ["산책", "등산", "무릎"],
    hasGiftOption: false
  },
  {
    id: "dad_message_photo",
    parentId: "parent_father",
    type: "message",
    icon: "💬",
    title: "사진에 반응하는 메시지",
    reason: "아빠는 사진 공유 후 자녀가 구체적으로 반응할 때 대화가 이어지는 패턴이 있어요.",
    guide: "\"아빠, 오늘 사진 어디예요? 등산로 처음 보는 곳이에요.\" 처럼 사진 디테일에 반응해보세요.",
    relatedKeywords: ["사진", "등산", "대화"],
    hasGiftOption: false
  },
  {
    id: "dad_hiking_gift",
    parentId: "parent_father",
    type: "gift",
    icon: "🎁",
    title: "등산 용품 선물",
    reason: "등산화가 낡았다고 언급하셔서 실용적인 등산 양말이나 등산 스틱이 자연스러워요.",
    guide: "\"아빠, 등산화 새로 사셨어요? 양말이라도 하나 사드릴게요.\" 처럼 부담 낮은 아이템부터 제안해보세요.",
    relatedKeywords: ["등산", "등산화", "양말"],
    hasGiftOption: true,
    giftNote: "등산 양말, 등산 스틱 추천"
  }
];

// ─── CheckInRecord ────────────────────────────────────────────────────────────

export interface CheckInRecord {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  health: 1 | 2 | 3 | 4 | 5;
  memo?: string;
  detailedEmotion?: string;
}

export const mockCheckIns: CheckInRecord[] = [
  { id: "ci1",  date: "2026-05-20", mood: 2, health: 3, detailedEmotion: "평온한" },
  { id: "ci2",  date: "2026-05-19", mood: 1, health: 2, memo: "오늘 산책 다녀왔어", detailedEmotion: "뿌듯한" },
  { id: "ci3",  date: "2026-05-18", mood: 3, health: 3 },
  { id: "ci4",  date: "2026-05-17", mood: 2, health: 4, memo: "무릎이 좀 아팠어", detailedEmotion: "걱정되는" },
  { id: "ci5",  date: "2026-05-16", mood: 1, health: 2, detailedEmotion: "감사한" },
  { id: "ci6",  date: "2026-05-15", mood: 2, health: 2, memo: "텃밭에 상추 심었어", detailedEmotion: "설레는" },
  { id: "ci7",  date: "2026-05-14", mood: 3, health: 3 },
  { id: "ci8",  date: "2026-05-13", mood: 2, health: 3, detailedEmotion: "여유로운" },
  { id: "ci9",  date: "2026-05-12", mood: 4, health: 4, memo: "허리가 계속 뻐근해", detailedEmotion: "아쉬운" },
  { id: "ci10", date: "2026-05-11", mood: 3, health: 3 },
  { id: "ci11", date: "2026-05-10", mood: 1, health: 2, memo: "생신 통화 좋았어", detailedEmotion: "감사한" },
  { id: "ci12", date: "2026-05-09", mood: 2, health: 3, detailedEmotion: "평온한" },
  { id: "ci13", date: "2026-05-08", mood: 1, health: 2, memo: "어버이날 꽃 받았어", detailedEmotion: "뭉클한" },
  { id: "ci14", date: "2026-05-07", mood: 3, health: 4 },
];

// ─── InboxEntry ───────────────────────────────────────────────────────────────

export interface InboxEntry {
  id: string;
  date: string;
  senderName: string;
  text: string;
  imageUrl?: string | null;
  read: boolean;
  reaction?: "thanks" | "miss" | "proud";
  reply?: string;
}

export const mockInbox: InboxEntry[] = [
  {
    id: "inbox1",
    date: "2026-05-20",
    senderName: child.name,
    text: "엄마 오늘 날씨가 너무 좋아요! 점심 맛있게 드세요 😊",
    imageUrl: null,
    read: false,
  },
  {
    id: "inbox2",
    date: "2026-05-18",
    senderName: child.name,
    text: "주말에 맛있는 거 먹었어요! 엄마도 드셨으면 좋았을 텐데",
    imageUrl: null,
    read: true,
    reaction: "miss",
  },
  {
    id: "inbox3",
    date: "2026-05-15",
    senderName: child.name,
    text: "엄마 텃밭 사진 보고 싶어요~ 요즘 뭐 심으셨어요?",
    imageUrl: null,
    read: true,
    reaction: "thanks",
    reply: "상추랑 깻잎 심었어~ 다음에 와서 먹어",
  },
];

// ─── ConsentSettings ──────────────────────────────────────────────────────────

export interface ConsentSettings {
  healthShare: boolean;
  moodShare: boolean;
  memoShare: boolean;
  activityShare: boolean;
}

export const defaultConsent: ConsentSettings = {
  healthShare: true,
  moodShare: true,
  memoShare: false,
  activityShare: true,
};

// ─────────────────────────────────────────────────────────────────────────────

export const parentHome = {
  screen: {
    eyebrow: "부모님 홈",
    titleLine1: "부모님의 온(溫)",
    titleLine2: "커넥트",
    boardTitle: "부모 홈",
    boardSubtitle: "큰 글씨 안부 보내기"
  },
  mainCardTitle: `${child.name}에게 안부 보내기`,
  sentStatusMessage: `${child.name}에게 안부를 보냈어요`,
  largeButtons: [
    { id: "meal", text: "밥 먹었니?", variant: "primary" },
    { id: "cheer", text: "오늘도 힘내", variant: "coralSoft" },
    { id: "call", text: "전화 가능하니?", variant: "honey" }
  ],
  recentReply: {
    title: "최근 답장",
    message: "\"잘 먹었어요!\" · 8분 전"
  },
  footerButtons: [
    { id: "change_signal_time", text: "안부 시간 바꾸기" },
    { id: "large_text_setting", text: "큰 글씨 설정" },
    { id: "manage_shared_info", text: "공유 정보 관리" }
  ]
};
