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
      <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>자주 느끼는 감정</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {sorted.map(([emotion, count]) => (
          <span
            key={emotion}
            style={{
              fontSize: "12px",
              background: "#F6D6BD",
              color: "#3D332C",
              borderRadius: "999px",
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {emotion}
            {count > 1 && (
              <span style={{ fontSize: "10px", color: "#6E4A39", marginLeft: "4px" }}>×{count}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
