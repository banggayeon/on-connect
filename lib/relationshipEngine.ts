import type {
  ContactRecord,
  ConversationMemo,
  DemoFamilyDataset,
  DemoParentProfile,
  RelationshipScoreBreakdown,
  RelationshipTemperatureLabel,
  RelationshipTemperatureResult
} from "@/lib/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_TEMPERATURE = 40;
const RECENT_WINDOW_DAYS = 7;
const CHECKIN_TARGET_COUNT = 7;
const CALL_TARGET_COUNT = 3;
const FAST_REPLY_MINUTES = 30;
const SLOW_REPLY_MINUTES = 240;

const CHECKIN_WEIGHT = 0.25;
const CALLS_WEIGHT = 0.20;
const REPLY_SPEED_WEIGHT = 0.15;
const DEPTH_WEIGHT = 0.25;
const BALANCE_WEIGHT = 0.15;

type WindowMetrics = {
  checkinCount: number;
  callCount: number;
  averageReplyMinutes: number | null;
  latestMemoTitle?: string;
  windowContacts: ContactRecord[];
  windowMemos: ConversationMemo[];
};

function parseDateOnly(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return Date.UTC(year, month - 1, day);
}

function isWithinInclusiveWindow(date: string, windowStart: number, windowEnd: number) {
  const value = parseDateOnly(date);

  return value >= windowStart && value <= windowEnd;
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getParentOrThrow(parentId: string, dataset: DemoFamilyDataset) {
  const parent = dataset.parents.find((candidate) => candidate.id === parentId);

  if (!parent) {
    throw new Error(`Parent not found: ${parentId}`);
  }

  return parent;
}

function getContactLogs(parent: DemoParentProfile) {
  return parent.contactLogs ?? parent.contactRecords30Days;
}

function getReplyLatencies(parent: DemoParentProfile, windowContacts: ContactRecord[], windowStart: number, windowEnd: number) {
  if (parent.replyLogs?.length) {
    return parent.replyLogs
      .filter((reply) => isWithinInclusiveWindow(reply.date, windowStart, windowEnd))
      .map((reply) => reply.responseLatencyMinutes);
  }

  return windowContacts
    .map((contact) => contact.responseLatencyMinutes)
    .filter((minutes): minutes is number => typeof minutes === "number");
}

function getWindowMetrics(parent: DemoParentProfile, referenceDate: string, offsetDays = 0): WindowMetrics {
  const windowEnd = parseDateOnly(referenceDate) - offsetDays * MS_PER_DAY;
  const windowStart = windowEnd - (RECENT_WINDOW_DAYS - 1) * MS_PER_DAY;
  const windowContacts = getContactLogs(parent).filter((contact) => isWithinInclusiveWindow(contact.date, windowStart, windowEnd));
  const replyLatencies = getReplyLatencies(parent, windowContacts, windowStart, windowEnd);
  const memos = parent.conversationMemos
    .filter((memo) => isWithinInclusiveWindow(memo.date, windowStart, windowEnd))
    .sort((a, b) => parseDateOnly(b.date) - parseDateOnly(a.date));

  return {
    checkinCount: windowContacts.filter((contact) => contact.channel !== "call" && contact.channel !== "missed").length,
    callCount: windowContacts.filter((contact) => contact.channel === "call").length,
    averageReplyMinutes: replyLatencies.length
      ? replyLatencies.reduce((sum, minutes) => sum + minutes, 0) / replyLatencies.length
      : null,
    latestMemoTitle: memos[0]?.title,
    windowContacts,
    windowMemos: memos
  };
}

function calculateEmotionalDepth(contacts: ContactRecord[], memos: ConversationMemo[]) {
  const sentiments = new Set(contacts.map((c) => c.sentiment));
  const sentimentVariety = sentiments.size / 3;

  const allTopics = memos.flatMap((m) => m.extractedTopics);
  const uniqueTopics = new Set(allTopics);
  const topicVariety = Math.min(1, uniqueTopics.size / 6);

  const memoRatio = memos.length > 0 ? Math.min(1, memos.length / 4) : 0;

  const rawDepth = sentimentVariety * 0.4 + topicVariety * 0.3 + memoRatio * 0.3;

  let label: string;
  if (rawDepth >= 0.65) label = "다양한 감정을 나누는 사이예요";
  else if (rawDepth >= 0.35) label = "일상과 감정 이야기를 함께 나눠요";
  else label = "주로 일상 안부 위주예요";

  return {
    score: roundToOneDecimal(rawDepth * MAX_TEMPERATURE * DEPTH_WEIGHT),
    label
  };
}

function calculateAccommodationBalance(contacts: ContactRecord[]) {
  if (contacts.length === 0) {
    return { score: roundToOneDecimal(0.5 * MAX_TEMPERATURE * BALANCE_WEIGHT), label: "기록이 충분하지 않아요", childInitiatedRatio: 0.5 };
  }

  const childInitiated = contacts.filter((c) => c.direction === "childToParent").length;
  const childInitiatedRatio = childInitiated / contacts.length;

  const distanceFromIdeal = Math.abs(childInitiatedRatio - 0.5);
  const rawBalance = 1 - Math.min(1, distanceFromIdeal * 2.5);

  let label: string;
  if (childInitiatedRatio >= 0.4 && childInitiatedRatio <= 0.65) {
    label = "서로 균형 있게 연락해요";
  } else if (childInitiatedRatio < 0.4) {
    label = "부모님이 주로 먼저 연락해요";
  } else {
    label = "자녀가 주로 먼저 연락해요";
  }

  return {
    score: roundToOneDecimal(rawBalance * MAX_TEMPERATURE * BALANCE_WEIGHT),
    label,
    childInitiatedRatio
  };
}

function generateInsights(parent: DemoParentProfile, metrics: WindowMetrics, scoreBreakdown: RelationshipScoreBreakdown): string[] {
  const insights: string[] = [];
  const { depth, balance, checkin, calls } = scoreBreakdown;

  const depthMax = MAX_TEMPERATURE * DEPTH_WEIGHT;
  if (depth.score >= depthMax * 0.7) {
    insights.push("다양한 주제로 감정을 나누는 깊은 대화를 이어가고 있어요.");
  } else if (depth.score >= depthMax * 0.35) {
    insights.push("감정 표현이 담긴 대화를 조금 더 늘려보는 건 어떨까요?");
  } else {
    insights.push("짧더라도 감정이 담긴 한 마디를 건네보세요.");
  }

  if (balance.childInitiatedRatio < 0.3) {
    insights.push(`${parent.displayName}이/가 먼저 연락하는 경우가 많아요. 오늘 먼저 안부를 전해보세요.`);
  } else if (balance.score >= MAX_TEMPERATURE * BALANCE_WEIGHT * 0.7) {
    insights.push("서로 균형 있게 연락하고 있어요. 지금처럼 꾸준히 이어가세요.");
  }

  if (checkin.count7Days < 3) {
    insights.push("이번 주 안부가 적었어요. 짧은 메시지 하나로 온도를 높여보세요.");
  }

  if (calls.count7Days === 0 && metrics.windowContacts.length > 0) {
    insights.push("이번 주 통화가 없었어요. 목소리를 들려드리는 건 언제나 좋아요.");
  }

  if (metrics.latestMemoTitle) {
    insights.push(`최근 대화에서 '${metrics.latestMemoTitle}' 흐름이 이어지고 있어요.`);
  }

  return insights.slice(0, 3);
}

function getReplySpeedRatio(averageMinutes: number | null) {
  if (averageMinutes === null) {
    return 0;
  }

  if (averageMinutes <= FAST_REPLY_MINUTES) {
    return 1;
  }

  if (averageMinutes >= SLOW_REPLY_MINUTES) {
    return 0;
  }

  return (SLOW_REPLY_MINUTES - averageMinutes) / (SLOW_REPLY_MINUTES - FAST_REPLY_MINUTES);
}

function getScoreBreakdown(metrics: WindowMetrics): RelationshipScoreBreakdown {
  const checkinScore = clamp(metrics.checkinCount / CHECKIN_TARGET_COUNT, 0, 1) * MAX_TEMPERATURE * CHECKIN_WEIGHT;
  const callScore = clamp(metrics.callCount / CALL_TARGET_COUNT, 0, 1) * MAX_TEMPERATURE * CALLS_WEIGHT;
  const replySpeedScore = getReplySpeedRatio(metrics.averageReplyMinutes) * MAX_TEMPERATURE * REPLY_SPEED_WEIGHT;
  const depthResult = calculateEmotionalDepth(metrics.windowContacts, metrics.windowMemos);
  const balanceResult = calculateAccommodationBalance(metrics.windowContacts);

  return {
    checkin: {
      weight: CHECKIN_WEIGHT,
      count7Days: metrics.checkinCount,
      targetCount: CHECKIN_TARGET_COUNT,
      score: roundToOneDecimal(checkinScore)
    },
    calls: {
      weight: CALLS_WEIGHT,
      count7Days: metrics.callCount,
      targetCount: CALL_TARGET_COUNT,
      score: roundToOneDecimal(callScore)
    },
    replySpeed: {
      weight: REPLY_SPEED_WEIGHT,
      averageMinutes: metrics.averageReplyMinutes === null ? null : roundToOneDecimal(metrics.averageReplyMinutes),
      score: roundToOneDecimal(replySpeedScore)
    },
    depth: {
      weight: DEPTH_WEIGHT,
      score: depthResult.score,
      label: depthResult.label
    },
    balance: {
      weight: BALANCE_WEIGHT,
      score: balanceResult.score,
      label: balanceResult.label,
      childInitiatedRatio: balanceResult.childInitiatedRatio
    }
  };
}

function getTemperatureFromBreakdown(scoreBreakdown: RelationshipScoreBreakdown) {
  return roundToOneDecimal(scoreBreakdown.checkin.score + scoreBreakdown.calls.score + scoreBreakdown.replySpeed.score);
}

function getLabel(temperature: number): RelationshipTemperatureLabel {
  if (temperature >= 32) {
    return "아주 따뜻함";
  }

  if (temperature >= 24) {
    return "따뜻함";
  }

  if (temperature >= 14) {
    return "보통";
  }

  return "조금 멀어요";
}

function formatReplyMinutes(averageMinutes: number | null) {
  if (averageMinutes === null) {
    return "응답 기록이 아직 충분하지 않아요";
  }

  if (averageMinutes < 60) {
    return `평균 ${roundToOneDecimal(averageMinutes)}분`;
  }

  return `평균 ${roundToOneDecimal(averageMinutes / 60)}시간`;
}

function buildReasons(parent: DemoParentProfile, metrics: WindowMetrics, scoreBreakdown: RelationshipScoreBreakdown) {
  const reasons = [
    `최근 7일 동안 ${parent.displayName}와 안부를 ${metrics.checkinCount}번 주고받았어요.`,
    `최근 7일 동안 통화는 ${metrics.callCount}번 있었어요.`,
    `답장 속도는 ${formatReplyMinutes(metrics.averageReplyMinutes)}으로 계산했어요.`
  ];

  if (metrics.latestMemoTitle) {
    reasons.push(`최근 대화 메모에서는 '${metrics.latestMemoTitle}' 흐름이 관계 판단에 참고됐어요.`);
  }

  if (scoreBreakdown.replySpeed.score < 3) {
    reasons.push("답장이 느린 편이라 다음 연락은 짧고 부담 없는 문장이 좋아요.");
  } else if (scoreBreakdown.replySpeed.score >= 7) {
    reasons.push("답장 흐름이 빠른 편이라 가벼운 일상 대화를 이어가기 좋아요.");
  }

  return reasons;
}

export function calculateRelationshipTemperature(
  parentId: string,
  dataset: DemoFamilyDataset,
  referenceDate: string,
  conversations?: ConversationMemo[]
): RelationshipTemperatureResult {
  const parent = getParentOrThrow(parentId, dataset);
  const currentMetrics = getWindowMetrics(parent, referenceDate);
  const previousMetrics = getWindowMetrics(parent, referenceDate, RECENT_WINDOW_DAYS);

  if (conversations) {
    currentMetrics.windowMemos = conversations.filter((m) => {
      const windowEnd = parseDateOnly(referenceDate);
      const windowStart = windowEnd - (RECENT_WINDOW_DAYS - 1) * MS_PER_DAY;
      return isWithinInclusiveWindow(m.date, windowStart, windowEnd);
    });
  }

  const scoreBreakdown = getScoreBreakdown(currentMetrics);
  const previousTemperature = getTemperatureFromBreakdown(getScoreBreakdown(previousMetrics));
  const temperature = getTemperatureFromBreakdown(scoreBreakdown);
  const delta = roundToOneDecimal(temperature - previousTemperature);

  return {
    parentId,
    referenceDate,
    temperature,
    label: getLabel(temperature),
    delta,
    scoreBreakdown,
    reasons: buildReasons(parent, currentMetrics, scoreBreakdown),
    insights: generateInsights(parent, currentMetrics, scoreBreakdown)
  };
}
