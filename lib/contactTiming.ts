export type NudgeLevel = "good" | "soon" | "overdue";

export type ContactNudge = {
  label: string;
  level: NudgeLevel;
};

const FREQUENCY_DAYS: Record<string, number> = {
  weekly: 7,
  monthly: 30,
  quarterly: 90,
};

export function getContactNudge(
  daysSince: number,
  desiredFrequency?: "weekly" | "monthly" | "quarterly"
): ContactNudge {
  const target = FREQUENCY_DAYS[desiredFrequency ?? "weekly"] ?? 7;

  if (daysSince <= target) {
    return { label: "잘 이어가고 있어요", level: "good" };
  }
  if (daysSince <= target * 2) {
    return { label: "슬슬 연락할 때", level: "soon" };
  }
  return { label: "오래됐어요", level: "overdue" };
}
