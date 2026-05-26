export type FamilyRole = "parent" | "child";
export type ConfidenceLevel = "low" | "medium" | "high";
export type LikelihoodLevel = "low" | "medium" | "high";
export type ReplyTone = "casual" | "warm" | "gentle" | "formal";
export type AccommodationLevel = "under" | "appropriate" | "over";

export type ReplyStrategy =
  | "light_check"
  | "warm_acknowledge"
  | "give_space"
  | "direct_call"
  | "apologize_first"
  | "share_daily_detail"
  | "ask_back";

export interface WarmReplyOption {
  text: string;
  tone: ReplyTone;
  strategy: ReplyStrategy;
  expressedSignals: string[];
  reason: string;
  displayLabel: string;
}

export interface EmotionContextAnalysisInput {
  messageText: string;
  senderRole: FamilyRole;
  receiverRole: FamilyRole;
  senderName?: string;
  receiverName?: string;
  recentMessages?: Array<{
    senderRole: FamilyRole;
    text: string;
    createdAt?: string;
  }>;
  relationshipContext?: {
    daysSinceLastContact?: number;
    usualReplyLength?: "short" | "medium" | "long";
    recentMoodTrend?: "positive" | "neutral" | "negative" | "unknown";
    preferredTopics?: string[];
    avoidedTopics?: string[];
    preferredContactTime?: string;
    parentCommunicationStyle?: "direct" | "indirect" | "worrying" | "quiet" | "expressive";
  };
}

export interface PossibleEmotionSignal {
  emotion: string;
  likelihood: LikelihoodLevel;
  reason: string;
}

export interface EmotionContextAnalysisResult {
  confidence: ConfidenceLevel;
  surfaceMeaning: string;
  possibleSignals: PossibleEmotionSignal[];
  contextFactors: string[];
  caution: string;
  recommendedStrategy: {
    style: ReplyStrategy;
    reason: string;
  };
  suggestedReplies: WarmReplyOption[];
  internalMetrics: {
    granularityScore: number;
    accommodationLevel: AccommodationLevel;
    messageLengthScore: number;
    contextRichnessScore: number;
  };
}

