"use client";

import type { CheckInRecord } from "@/lib/mockData";

interface Props {
  checkIns: CheckInRecord[];
  maxTags?: number;
}

export function EmotionSignalTags({ checkIns, maxTags = 5 }: Props) {
  const freq: Record<string, number> = {};
  for (const ci of checkIns) {
    if (ci.detailedEmotion) {
      freq[ci.detailedEmotion] = (freq[ci.detailedEmotion] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags);

  if (sorted.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>자주 느끼는 감정</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {sorted.map(([emotion, count]) => (
          <span
            key={emotion}
            style={{
              fontSize: "12px",
              background: "#FFF1E6",
              color: "#C05A2A",
              border: "1px solid #F5C8A0",
              borderRadius: "999px",
              padding: "3px 10px",
              fontWeight: 500,
            }}
          >
            {emotion}
            {count > 1 && (
              <span style={{ fontSize: "10px", color: "#D4884A", marginLeft: "4px" }}>×{count}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
