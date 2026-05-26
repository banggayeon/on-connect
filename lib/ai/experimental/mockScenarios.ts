import type { EmotionContextAnalysisInput } from "./contextTypes";

// 수동 import로만 확인하는 실험용 시나리오입니다. 앱 실행 경로에는 연결하지 않습니다.
export const mockEmotionContextScenarios: EmotionContextAnalysisInput[] = [
  {
    messageText: "밥 먹었니?",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "엄마",
    relationshipContext: {
      daysSinceLastContact: 2,
      usualReplyLength: "medium",
      recentMoodTrend: "neutral",
      parentCommunicationStyle: "worrying",
    },
  },
  {
    messageText: "언제 집에 오니?",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "아빠",
    relationshipContext: {
      daysSinceLastContact: 10,
      usualReplyLength: "medium",
      recentMoodTrend: "neutral",
      parentCommunicationStyle: "direct",
    },
  },
  {
    messageText: "괜찮다",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "엄마",
    recentMessages: [
      { senderRole: "child", text: "이번 주는 못 갈 것 같아요" },
      { senderRole: "parent", text: "그래 괜찮다" },
    ],
    relationshipContext: {
      daysSinceLastContact: 5,
      usualReplyLength: "medium",
      recentMoodTrend: "unknown",
      parentCommunicationStyle: "quiet",
    },
  },
  {
    messageText: "요즘 바쁘니?",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "엄마",
    relationshipContext: {
      daysSinceLastContact: 8,
      usualReplyLength: "medium",
      recentMoodTrend: "neutral",
      parentCommunicationStyle: "indirect",
    },
  },
  {
    messageText: "ㅇㅇ",
    senderRole: "child",
    receiverRole: "parent",
    receiverName: "엄마",
    recentMessages: [
      { senderRole: "parent", text: "밥은 먹었니?" },
      { senderRole: "parent", text: "늦게 다니지 말고" },
    ],
    relationshipContext: {
      daysSinceLastContact: 1,
      usualReplyLength: "medium",
      recentMoodTrend: "negative",
      parentCommunicationStyle: "worrying",
    },
  },
  {
    messageText: "나중에 전화할게",
    senderRole: "child",
    receiverRole: "parent",
    receiverName: "아빠",
    relationshipContext: {
      daysSinceLastContact: 4,
      usualReplyLength: "short",
      recentMoodTrend: "neutral",
      preferredContactTime: "저녁",
      parentCommunicationStyle: "direct",
    },
  },
  {
    messageText: "그래",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "엄마",
    recentMessages: [
      { senderRole: "parent", text: "잘 지내니?", createdAt: "2026-05-01" },
      { senderRole: "parent", text: "요즘 많이 바쁘니?", createdAt: "2026-05-10" },
      { senderRole: "child", text: "죄송해요 이제 봤어요", createdAt: "2026-05-20" },
    ],
    relationshipContext: {
      daysSinceLastContact: 19,
      usualReplyLength: "medium",
      recentMoodTrend: "negative",
      parentCommunicationStyle: "quiet",
    },
  },
  {
    messageText: "허리가 좀 아프네",
    senderRole: "parent",
    receiverRole: "child",
    senderName: "아빠",
    recentMessages: [
      { senderRole: "child", text: "지난번에 허리 괜찮아졌어요?" },
      { senderRole: "parent", text: "그때보단 나아" },
    ],
    relationshipContext: {
      daysSinceLastContact: 3,
      usualReplyLength: "short",
      recentMoodTrend: "negative",
      preferredTopics: ["건강", "병원 일정"],
      parentCommunicationStyle: "indirect",
    },
  },
];

