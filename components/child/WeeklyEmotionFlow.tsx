"use client";

import type { CheckInRecord } from "@/lib/mockData";

const MOOD_EMOJIS = ["😄", "🙂", "😐", "😔", "😢"];
const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  checkIns: CheckInRecord[];
  label?: string;
}

export function WeeklyEmotionFlow({ checkIns, label = "이번 주 기분 흐름" }: Props) {
  const today = new Date("2026-05-21");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const ci = checkIns.find((c) => c.date === dateStr);
    const dayIdx = d.getDay();
    return {
      day: WEEK_DAYS[dayIdx === 0 ? 6 : dayIdx - 1],
      dateStr,
      ci,
      isToday: i === 6,
    };
  });

  return (
    <div>
      <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>{label}</p>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {days.map(({ day, ci, isToday }) => (
          <div
            key={day}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              opacity: ci ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: "20px" }}>{ci ? MOOD_EMOJIS[ci.mood - 1] : "○"}</span>
            <span
              style={{
                fontSize: "11px",
                color: isToday ? "#241E1A" : "#8A6B5C",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
