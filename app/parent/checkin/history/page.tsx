"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { mockCheckIns } from "@/lib/mockData";

const MOOD_EMOJIS = ["😄", "🙂", "😐", "😔", "😢"];
const HEALTH_EMOJIS = ["💪", "👍", "🤔", "🤕", "🏥"];

const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function getWeekData() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const ci = mockCheckIns.find((c) => c.date === dateStr);
    return { day: WEEK_DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], dateStr, ci };
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export default function CheckinHistoryPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const weekData = getWeekData();

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          지난 기록
        </h1>
      </div>

      {/* 이번 주 흐름 */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 16px", fontWeight: 600 }}>
          이번 주 기분 흐름
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {weekData.map(({ day, ci }) => (
            <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "22px" }}>
                {ci ? MOOD_EMOJIS[ci.mood - 1] : "○"}
              </span>
              <span style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C" }}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 날짜별 기록 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mockCheckIns.map((ci) => {
          const isOpen = openId === ci.id;
          return (
            <button
              key={ci.id}
              type="button"
              onClick={() => setOpenId(isOpen ? null : ci.id)}
              style={{
                width: "100%", textAlign: "left", background: "white", borderRadius: "20px",
                padding: "18px 20px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)",
                border: "none", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isOpen && (ci.memo || ci.detailedEmotion) ? "10px" : "0" }}>
                <div>
                  <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: 0 }}>
                    {formatDate(ci.date)}
                  </p>
                  {ci.detailedEmotion && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        fontSize: "var(--parent-font-caption)",
                        background: "#FFEDE0",
                        color: "#C05A2A",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontWeight: 500,
                      }}
                    >
                      {ci.detailedEmotion}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "22px" }}>{MOOD_EMOJIS[ci.mood - 1]}</span>
                  <span style={{ fontSize: "22px" }}>{HEALTH_EMOJIS[ci.health - 1]}</span>
                </div>
              </div>
              {isOpen && ci.memo && (
                <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "10px 0 0", lineHeight: 1.5, borderTop: "1px solid #FFF0E6", paddingTop: "10px" }}>
                  {ci.memo}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </ParentAppShell>
  );
}
