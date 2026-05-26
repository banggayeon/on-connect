export type EmotionCluster = "warmth" | "concern" | "daily";
export type EmotionValence = "positive" | "negative" | "neutral";
export type EmotionArousal = "high" | "medium" | "low";

export interface EmotionDefinition {
  id: string;
  ko: string;
  en: string;
  valence: EmotionValence;
  arousal: EmotionArousal;
  cluster: EmotionCluster;
  description: string;
  exampleMessages: string[];
}

// 확정 판정이 아니라 부모-자녀 대화에서 가능한 정서 신호 후보를 만들기 위한 분류 체계입니다.
export const EXPERIMENTAL_EMOTION_TAXONOMY: Record<string, EmotionDefinition> = {
  gratitude: {
    id: "gratitude",
    ko: "고마움",
    en: "gratitude",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "상대의 관심, 배려, 도움을 알아차리고 고맙게 느끼는 신호입니다.",
    exampleMessages: ["걱정해줘서 고마워", "덕분에 잘 해결했어"],
  },
  pride: {
    id: "pride",
    ko: "뿌듯함",
    en: "pride",
    valence: "positive",
    arousal: "medium",
    cluster: "warmth",
    description: "상대의 성장이나 노력을 기쁘게 바라보는 신호입니다.",
    exampleMessages: ["우리 딸 대단하네", "잘하고 있어서 뿌듯하다"],
  },
  longing: {
    id: "longing",
    ko: "그리움",
    en: "longing",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "연락이나 만남을 통해 연결감을 다시 느끼고 싶은 신호입니다.",
    exampleMessages: ["언제 집에 오니?", "얼굴 한번 보자"],
  },
  relief: {
    id: "relief",
    ko: "안도감",
    en: "relief",
    valence: "positive",
    arousal: "low",
    cluster: "warmth",
    description: "상대가 괜찮다는 확인을 받고 마음이 놓이는 신호입니다.",
    exampleMessages: ["잘 도착했다니 다행이다", "괜찮다니 마음 놓인다"],
  },
  joy: {
    id: "joy",
    ko: "기쁨",
    en: "joy",
    valence: "positive",
    arousal: "high",
    cluster: "warmth",
    description: "좋은 소식이나 만남에 반응하는 밝은 정서 신호입니다.",
    exampleMessages: ["좋은 소식이네!", "오면 맛있는 거 해줄게"],
  },
  affection: {
    id: "affection",
    ko: "애정",
    en: "affection",
    valence: "positive",
    arousal: "medium",
    cluster: "warmth",
    description: "가족 사이의 애틋함과 돌봄이 담긴 정서 신호입니다.",
    exampleMessages: ["항상 조심해", "엄마는 네가 제일 걱정이다"],
  },
  worry: {
    id: "worry",
    ko: "걱정",
    en: "worry",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "상대의 건강, 식사, 안전, 생활 리듬을 염려하는 신호입니다.",
    exampleMessages: ["밥 먹었니?", "늦게 다니지 마라"],
  },
  loneliness: {
    id: "loneliness",
    ko: "외로움",
    en: "loneliness",
    valence: "negative",
    arousal: "low",
    cluster: "concern",
    description: "연락 공백이나 만남 부족에서 생길 수 있는 쓸쓸함의 신호입니다.",
    exampleMessages: ["요즘 바쁘니?", "전화 한번 하자"],
  },
  disappointment: {
    id: "disappointment",
    ko: "서운함",
    en: "disappointment",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "기대했던 반응이나 연락이 오지 않아 생길 수 있는 섭섭함의 신호입니다.",
    exampleMessages: ["그래", "알았다"],
  },
  guilt: {
    id: "guilt",
    ko: "미안함",
    en: "guilt",
    valence: "negative",
    arousal: "medium",
    cluster: "concern",
    description: "연락 공백이나 돌봄 부족을 의식할 때 나타날 수 있는 신호입니다.",
    exampleMessages: ["요즘 연락 못 해서 미안해", "자주 못 가서 죄송해요"],
  },
  helplessness: {
    id: "helplessness",
    ko: "무력감",
    en: "helplessness",
    valence: "negative",
    arousal: "low",
    cluster: "concern",
    description: "도와주고 싶지만 방법이 제한되어 있다고 느끼는 신호입니다.",
    exampleMessages: ["내가 해줄 수 있는 게 없네", "혼자 괜찮으려나"],
  },
  frustration: {
    id: "frustration",
    ko: "답답함",
    en: "frustration",
    valence: "negative",
    arousal: "high",
    cluster: "concern",
    description: "마음이 잘 전달되지 않거나 대화가 막힌 듯한 신호입니다.",
    exampleMessages: ["몇 번을 말해야 하니", "왜 답이 없니"],
  },
  curiosity: {
    id: "curiosity",
    ko: "궁금함",
    en: "curiosity",
    valence: "neutral",
    arousal: "medium",
    cluster: "daily",
    description: "상대의 일상과 근황을 알고 싶은 신호입니다.",
    exampleMessages: ["뭐 하니?", "요즘 어떻게 지내니?"],
  },
  comfort: {
    id: "comfort",
    ko: "편안함",
    en: "comfort",
    valence: "positive",
    arousal: "low",
    cluster: "daily",
    description: "특별한 감정 강조 없이 안정적으로 주고받는 일상 신호입니다.",
    exampleMessages: ["응", "알겠어"],
  },
  boredom: {
    id: "boredom",
    ko: "심심함",
    en: "boredom",
    valence: "neutral",
    arousal: "low",
    cluster: "daily",
    description: "특별한 용건보다 대화를 이어가고 싶은 일상적 신호입니다.",
    exampleMessages: ["뭐하니", "그냥 전화했다"],
  },
  routine_check: {
    id: "routine_check",
    ko: "일상 확인",
    en: "routine check",
    valence: "neutral",
    arousal: "low",
    cluster: "daily",
    description: "식사, 귀가, 수면처럼 반복되는 생활 리듬을 확인하는 신호입니다.",
    exampleMessages: ["밥 먹었니?", "집에는 들어갔니?"],
  },
};

export const EXPERIMENTAL_EMOTION_IDS = Object.keys(EXPERIMENTAL_EMOTION_TAXONOMY);

