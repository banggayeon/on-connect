export type FamilyRole = "child" | "mother" | "father" | "friend" | "acquaintance";

export type TonePreference = "warm" | "practical" | "playful" | "brief" | "polite";

export type ConsentScope =
  | "preferredContactTime"
  | "interests"
  | "conversationNotes"
  | "careSignals"
  | "giftHints"
  | "location";

export type ContactChannel = "call" | "text" | "photo" | "video" | "missed" | "copy";

export type ContactDirection = "childToParent" | "parentToChild";

export type ContactSentiment = "warm" | "neutral" | "concerned" | "missed";

export type CareSignalCategory = "health" | "mood" | "routine" | "relationship" | "lifeEvent";

export type CareSignalSeverity = "low" | "medium" | "high";

export type GiftCategory = "health" | "food" | "hobby" | "comfort" | "experience" | "practical";

export type RecommendationPriority = "low" | "medium" | "high";

export type DemoPerson = {
  id: string;
  role: FamilyRole;
  name: string;
  displayName: string;
  age: number;
  relationLabel: string;
};

export type ConsentSetting = {
  scope: ConsentScope;
  label: string;
  enabled: boolean;
  description: string;
};

export type ParentPreferenceProfile = {
  interests: string[];
  birthday: {
    month: number;
    day: number;
    label: string;
  };
  preferredContactWindows: Array<{
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    reason: string;
  }>;
  tonePreferences: TonePreference[];
  avoidedTopics: string[];
  consentSettings: ConsentSetting[];
};

export type ContactRecord = {
  id: string;
  parentId: string;
  date: string;
  channel: ContactChannel;
  direction: ContactDirection;
  durationMinutes?: number;
  summary: string;
  sentiment: ContactSentiment;
  responseLatencyMinutes?: number;
  tags: string[];
};

export type ReplyLog = {
  id: string;
  parentId: string;
  date: string;
  responseLatencyMinutes: number;
  sourceContactId?: string;
};

export type ConversationMemo = {
  id: string;
  parentId: string;
  date: string;
  title: string;
  memo: string;
  extractedTopics: string[];
  suggestedFollowUp: string;
};

export type CareSignal = {
  id: string;
  parentId: string;
  date: string;
  category: CareSignalCategory;
  severity: CareSignalSeverity;
  title: string;
  evidence: string;
  recommendationHint: string;
};

export type GiftCandidate = {
  id: string;
  parentId: string;
  name: string;
  category: GiftCategory;
  priceRange: string;
  occasionFit: string;
  reason: string;
  careActionPairing: string;
  priority: RecommendationPriority;
};

export type AgentSeedSummary = {
  relationshipTemperature: {
    valueCelsius: number;
    trendCelsius: number;
    progressPercent: number;
    stateLabel: string;
    rationale: string;
  };
  parentBriefing: {
    title: string;
    summary: string;
    recommendedAction: string;
  };
  warmReplyAI: {
    incomingMessage: string;
    intent: string;
    suggestedReply: string;
    reason: string;
  };
  careAction: {
    title: string;
    body: string;
    priority: RecommendationPriority;
  };
};

export type DemoParentProfile = DemoPerson & {
  role: "mother" | "father" | "friend" | "acquaintance";
  relationshipType?: "family" | "friend" | "acquaintance";
  desiredFrequency?: "weekly" | "monthly" | "quarterly";
  isMutual?: boolean;
  preferenceProfile: ParentPreferenceProfile;
  contactLogs?: ContactRecord[];
  replyLogs?: ReplyLog[];
  contactRecords30Days: ContactRecord[];
  conversationMemos: ConversationMemo[];
  careSignals: CareSignal[];
  giftCandidates: GiftCandidate[];
  agentSeedSummary: AgentSeedSummary;
};

export type RelationshipTemperatureLabel = "아주 따뜻함" | "따뜻함" | "보통" | "조금 멀어요";

export interface EmotionalQualityMetrics {
  depthScore: number;
  balanceScore: number;
  depthLabel: string;
  balanceLabel: string;
}

export type RelationshipScoreBreakdown = {
  checkin: {
    weight: number;
    count7Days: number;
    targetCount: number;
    score: number;
  };
  calls: {
    weight: number;
    count7Days: number;
    targetCount: number;
    score: number;
  };
  replySpeed: {
    weight: number;
    averageMinutes: number | null;
    score: number;
  };
  depth: {
    weight: number;
    score: number;
    label: string;
  };
  balance: {
    weight: number;
    score: number;
    label: string;
    childInitiatedRatio: number;
  };
};

export type RelationshipTemperatureResult = {
  parentId: string;
  referenceDate: string;
  temperature: number;
  label: RelationshipTemperatureLabel;
  delta: number;
  scoreBreakdown: RelationshipScoreBreakdown;
  reasons: string[];
  insights: string[];
};

export type AiMockTask = "briefing" | "warm-reply" | "care-action" | "report";

export type AiMockRequest = {
  userId?: string;
  parentId?: string;
  currentSituation?: string;
  rawMessage?: string;
  referenceDate?: string;
};

export type AiMockResponse = {
  task: AiMockTask;
  userId: string;
  parentId: string;
  summary: string;
  recommendedMessage: string;
  evidence: string[];
  reasoning: string;
  createdAt: string;
  meta: {
    mode: "mock";
    promptTemplateId: string;
    fallback: boolean;
  };
};

// ============================================
// 정서 맥락 분석 결과 (Emotion Context Analysis)
// ============================================
// 설계 철학:
// - 단일 메시지로 감정을 확정하지 않는다
// - 메시지 + 대화 흐름 + 평소 패턴 + 연락 리듬을 함께 고려한다
// - 결과는 "확정"이 아니라 "가능한 신호"로 제시한다
// - 학술 근거: Conceptual Act Theory (Barrett) —
//   감정은 고정된 라벨이 아니라 맥락 속에서 구성된다
// ============================================

export interface EmotionContextAnalysisResult {
  confidence: "low" | "medium" | "high";
  surfaceMeaning: string;
  possibleSignals: Array<{
    emotion: string;
    likelihood: "low" | "medium" | "high";
    reason: string;
  }>;
  contextFactors: Array<{
    factor: string;
    source: "message" | "pattern" | "rhythm" | "profile";
    impact: "low" | "medium" | "high";
  }>;
  caution: string;
  recommendedStrategy: {
    style: string;
    reason: string;
  };
  suggestedReplies: WarmReplyOption[];
  _internal: {
    granularityScore: number;
    accommodationLevel: "under" | "appropriate" | "over";
  };
}

export interface EmotionAnalysisRequest {
  messageText: string;
  senderRole: "parent" | "child";
  senderName?: string;
  receiverRole: "parent" | "child";
  context?: {
    recentMessages?: Array<{
      text: string;
      sender: "parent" | "child";
      timestamp?: string;
    }>;
    daysSinceLastContact?: number;
    usualMessageLength?: "short" | "medium" | "long";
    usualTone?: string;
    recentCheckInMoods?: number[];
  };
}

export interface WarmReplyOption {
  text: string;
  tone: "warm" | "casual" | "formal";
  emotionExpressed: string[];
  expressionLevel: "minimal" | "moderate" | "rich";
  reason: string;
}

export const STRATEGY_LABELS: Record<string, { ko: string; description: string; icon: string }> = {
  light_check: {
    ko: "가볍게 안부 확인",
    description: "부담 없이 가벼운 한마디로 안부를 물어보세요",
    icon: "👋",
  },
  warm_acknowledge: {
    ko: "따뜻하게 공감",
    description: "이런 마음일 수 있다는 걸 가볍게 표현해보세요",
    icon: "🤗",
  },
  give_space: {
    ko: "여유 주기",
    description: "지금은 기다려주는 게 좋을 수 있어요",
    icon: "🌿",
  },
  direct_call: {
    ko: "직접 전화",
    description: "텍스트보다 목소리가 더 전달될 상황이에요",
    icon: "📞",
  },
  apologize_first: {
    ko: "먼저 마음 전하기",
    description: "미안한 마음을 먼저 표현하면 대화가 열려요",
    icon: "💌",
  },
};

// ============================================
// 안부 추천 & 답장 추천 (Check-in / Reply Suggestion)
// ============================================

export type CheckInCategory = "weather" | "routine" | "memory" | "care" | "light";

export type CheckInSuggestion = {
  id: string;
  category: CheckInCategory;
  title: string;
  message: string;
  reason: string;
  tone: "gentle" | "casual" | "polite" | "warm";
  contextTags: string[];
  bestTimeLabel?: string;
  recipientName: string;
  recipientRole: string;
};

export type ReplySuggestion = {
  id: string;
  text: string;
  tone: "short" | "warm" | "reassuring";
  label: string;
};

export type WeatherContext = {
  condition: string;
  temperature?: number;
  summary: string;
  checkInHint: string;
};

export type DemoFamilyDataset = {
  // Mock dataset version for future demo migration and calculation reproducibility.
  version: string;
  // Anchor date used by all relative demo records. This is not a real user timestamp.
  generatedAt: string;
  // One child user who receives recommendations and acts on them.
  child: DemoPerson & {
    role: "child";
    familyNickname: string;
  };
  // Parent profiles contain consented inputs for relationship temperature, briefing, reply, and care action demos.
  parents: DemoParentProfile[];
};
