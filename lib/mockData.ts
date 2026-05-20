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
    description: "엄마에게는 식사 이야기, 아빠에게는 사진 반응이 자연스러워요."
  },
  parentPromptTitle: "엄마가 보낼 안부",
  suggestions: [
    {
      id: "evening_meal",
      text: "오늘 저녁 뭐 먹니?",
      helper: "엄마가 자주 시작하는 식사 안부",
      tone: "coral" as const,
      active: true
    },
    {
      id: "rest",
      text: "오늘도 많이 바빴니?",
      helper: "업무가 바쁜 민권에게 부담 없는 질문",
      tone: "coral" as const,
      active: false
    },
    {
      id: "dad_photo_reply",
      text: "사진 멋지네요. 주말에 같이 걸어요.",
      helper: "아빠에게 맞는 짧고 실용적인 답장",
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
  quickReplies: ["잘 먹었어요", "챙겼어요", "고마워요", "전화할게요"],
  sendButtonLabel: "안부 보내기",
  weatherNotice: "오늘 서울은 저녁에 선선해서 산책 이야기도 자연스러워요.",
  warmReplyAI: {
    label: "Warm Reply AI · 추천 이유",
    title: "짧게 답해도 따뜻하게 느껴지는 문장을 골랐어요.",
    reason: mother.agentSeedSummary.warmReplyAI.reason,
    suggestedReply: mother.agentSeedSummary.warmReplyAI.suggestedReply
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
