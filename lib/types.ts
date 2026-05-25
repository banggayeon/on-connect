export type FamilyRole = "child" | "mother" | "father";

export type TonePreference = "warm" | "practical" | "playful" | "brief" | "polite";

export type ConsentScope =
  | "preferredContactTime"
  | "interests"
  | "conversationNotes"
  | "careSignals"
  | "giftHints"
  | "location";

export type ContactChannel = "call" | "text" | "photo" | "video" | "missed";

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
  role: "mother" | "father";
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

export type RelationshipScoreBreakdown = {
  checkin: {
    weight: 0.4;
    count7Days: number;
    targetCount: number;
    score: number;
  };
  calls: {
    weight: 0.4;
    count7Days: number;
    targetCount: number;
    score: number;
  };
  replySpeed: {
    weight: 0.2;
    averageMinutes: number | null;
    score: number;
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
