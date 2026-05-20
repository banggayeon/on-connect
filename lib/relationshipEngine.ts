import type {
  ContactRecord,
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

type WindowMetrics = {
  checkinCount: number;
  callCount: number;
  averageReplyMinutes: number | null;
  latestMemoTitle?: string;
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
    latestMemoTitle: memos[0]?.title
  };
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
  const checkinScore = (clamp(metrics.checkinCount / CHECKIN_TARGET_COUNT, 0, 1) * MAX_TEMPERATURE * 0.4);
  const callScore = (clamp(metrics.callCount / CALL_TARGET_COUNT, 0, 1) * MAX_TEMPERATURE * 0.4);
  const replySpeedScore = getReplySpeedRatio(metrics.averageReplyMinutes) * MAX_TEMPERATURE * 0.2;

  return {
    checkin: {
      weight: 0.4,
      count7Days: metrics.checkinCount,
      targetCount: CHECKIN_TARGET_COUNT,
      score: roundToOneDecimal(checkinScore)
    },
    calls: {
      weight: 0.4,
      count7Days: metrics.callCount,
      targetCount: CALL_TARGET_COUNT,
      score: roundToOneDecimal(callScore)
    },
    replySpeed: {
      weight: 0.2,
      averageMinutes: metrics.averageReplyMinutes === null ? null : roundToOneDecimal(metrics.averageReplyMinutes),
      score: roundToOneDecimal(replySpeedScore)
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
  referenceDate: string
): RelationshipTemperatureResult {
  const parent = getParentOrThrow(parentId, dataset);
  const currentMetrics = getWindowMetrics(parent, referenceDate);
  const previousMetrics = getWindowMetrics(parent, referenceDate, RECENT_WINDOW_DAYS);
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
    reasons: buildReasons(parent, currentMetrics, scoreBreakdown)
  };
}
