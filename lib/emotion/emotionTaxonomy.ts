// ============================================
// 감정 분류 체계 (Emotion Taxonomy)
// ============================================
// 학술 배경:
// - Emotional Granularity (Lisa Feldman Barrett)
//   감정을 세밀하게 구분하는 능력이 정신건강과 직결
// - Plutchik's Wheel of Emotions 기반, 부모-자녀 도메인 특화
// ============================================

export interface EmotionDefinition {
  id: string;
  ko: string;
  en: string;
  valence: "positive" | "negative" | "neutral";
  arousal: "high" | "medium" | "low";
  cluster: "warmth" | "concern" | "daily";
  description: string;
}

export const EMOTION_TAXONOMY: Record<string, EmotionDefinition> = {
  // === Warmth Cluster ===
  gratitude: {
    id: "gratitude",
    ko: "고마움",
    en: "gratitude",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "상대가 해준 것에 대한 감사",
  },
  pride: {
    id: "pride",
    ko: "뿌듯함",
    en: "pride",
    valence: "positive",
    arousal: "medium",
    cluster: "warmth",
    description: "자녀의 성장이나 부모의 노력에 대한 자부심",
  },
  longing: {
    id: "longing",
    ko: "그리움",
    en: "longing",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "만나지 못하는 상대에 대한 그리움",
  },
  relief: {
    id: "relief",
    ko: "안도감",
    en: "relief",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "걱정하던 일이 괜찮다는 것을 알았을 때",
  },
  joy: {
    id: "joy",
    ko: "기쁨",
    en: "joy",
    valence: "positive",
    arousal: "high",
    cluster: "warmth",
    description: "함께하는 순간이나 좋은 소식에 대한 기쁨",
  },
  affection: {
    id: "affection",
    ko: "애틋함",
    en: "affection",
    valence: "positive",
    arousal: "medium",
    cluster: "warmth",
    description: "가족이라서 느끼는 깊은 유대감",
  },

  // === Concern Cluster ===
  worry: {
    id: "worry",
    ko: "걱정",
    en: "worry",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "상대의 건강, 생활, 안전에 대한 염려",
  },
  loneliness: {
    id: "loneliness",
    ko: "외로움",
    en: "loneliness",
    valence: "negative",
    arousal: "low",
    cluster: "concern",
    description: "연락이 뜸하거나 혼자 있는 시간이 길 때",
  },
  disappointment: {
    id: "disappointment",
    ko: "서운함",
    en: "disappointment",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "기대에 미치지 못하는 상대의 행동에 대한 섭섭함",
  },
  helplessness: {
    id: "helplessness",
    ko: "무력감",
    en: "helplessness",
    valence: "negative",
    arousal: "low",
    cluster: "concern",
    description: "도움을 주고 싶지만 할 수 없을 때",
  },
  guilt: {
    id: "guilt",
    ko: "미안함",
    en: "guilt",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "연락을 못 드렸거나 기대에 못 미쳤을 때의 죄책감",
  },
  frustration: {
    id: "frustration",
    ko: "답답함",
    en: "frustration",
    valence: "negative",
    arousal: "high",
    cluster: "concern",
    description: "소통이 안 되거나 마음이 전해지지 않을 때",
  },

  // === Daily Cluster ===
  curiosity: {
    id: "curiosity",
    ko: "궁금함",
    en: "curiosity",
    valence: "neutral",
    arousal: "medium",
    cluster: "daily",
    description: "상대의 일상이나 근황에 대한 관심",
  },
  comfort: {
    id: "comfort",
    ko: "편안함",
    en: "comfort",
    valence: "positive",
    arousal: "low",
    cluster: "daily",
    description: "특별한 일 없이 안정된 상태",
  },
  boredom: {
    id: "boredom",
    ko: "심심함",
    en: "boredom",
    valence: "neutral",
    arousal: "low",
    cluster: "daily",
    description: "할 일이 없거나 누군가와 이야기하고 싶을 때",
  },
};

export const CLUSTER_COLORS: Record<EmotionDefinition["cluster"], { bg: string; text: string; border: string }> = {
  warmth: { bg: "#FFF1E6", text: "#C05A2A", border: "#F5C8A0" },
  concern: { bg: "#EDF4FF", text: "#2A5AC0", border: "#A0C0F5" },
  daily:   { bg: "#F4F4F4", text: "#555555", border: "#D0D0D0" },
};

export type AccommodationLevel = "under" | "appropriate" | "over";

export const ACCOMMODATION_DESCRIPTIONS: Record<AccommodationLevel, { ko: string; description: string }> = {
  under: {
    ko: "과소 수용",
    description: "상대를 고려하지 않은 너무 짧거나 무심한 표현이에요",
  },
  appropriate: {
    ko: "적절한 수용",
    description: "상대의 상황과 감정에 맞게 조절된 표현이에요",
  },
  over: {
    ko: "과잉 수용",
    description: "과도하게 조절된 표현으로, 잔소리처럼 느껴질 수 있어요",
  },
};
