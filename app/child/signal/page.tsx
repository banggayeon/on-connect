"use client";

import { useState } from "react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { ParentToggle } from "@/components/child/ParentToggle";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { demoDataset } from "@/lib/mockData";
import { useRouter } from "next/navigation";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const CAL_YEAR = 2026;
const CAL_MONTH = 4; // May (0-indexed)

function buildMayCalendar() {
  const firstDay = new Date(CAL_YEAR, CAL_MONTH, 1).getDay();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MAY_CELLS = buildMayCalendar();

function getMayContactDays(parentId: string): Set<number> {
  const parent = demoDataset.parents.find((p) => p.id === parentId);
  if (!parent) return new Set();
  const days = new Set<number>();
  for (const record of parent.contactRecords30Days ?? []) {
    if (record.date.startsWith("2026-05-")) {
      days.add(parseInt(record.date.slice(8), 10));
    }
  }
  return days;
}

const PARENT_META: Record<string, { char: string; tone: string; label: string }> = {
  parent_mother: { char: "엄", tone: "#F1D6CC", label: "엄마에게" },
  parent_father: { char: "아", tone: "#F1E5C8", label: "아빠에게" },
};

const MOOD_EMOJIS: { emoji: string; label: string }[] = [
  { emoji: "😄", label: "아주 좋아요" },
  { emoji: "🙂", label: "좋아요" },
  { emoji: "😐", label: "보통이에요" },
  { emoji: "😔", label: "조금 힘들어요" },
  { emoji: "😢", label: "힘들어요" },
];

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ char, tone = "#F1D6CC", size = 28 }: { char: string; tone?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: tone,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.42), fontWeight: 700, color: "#241E1A",
      letterSpacing: "-0.02em", flexShrink: 0,
    }}>
      {char}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function ChildSignalPage() {
  const router = useRouter();
  const { selectedParentId } = useSelectedParent();
  const [quickMood, setQuickMood] = useState<number | null>(null);

  const meta = PARENT_META[selectedParentId] ?? PARENT_META["parent_mother"];
  const mayContactDays = getMayContactDays(selectedParentId);

  const now = new Date();
  const isSameMonth = now.getFullYear() === CAL_YEAR && now.getMonth() === CAL_MONTH;
  const todayDay = isSameMonth ? now.getDate() : now < new Date(CAL_YEAR, CAL_MONTH, 1) ? 0 : 31;

  return (
    <ChildAppShell>
      {/* 아바타 + 레이블 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 4 }}>
        <Avatar char={meta.char} tone={meta.tone} size={28} />
        <span style={{ fontSize: "13px", color: "#8A6B5C", fontWeight: 500 }}>
          {meta.label} · 안부 신호
        </span>
      </div>

      <h1 style={{
        fontSize: "30px", lineHeight: 1.22, fontWeight: 700, letterSpacing: "-0.03em",
        margin: "10px 0 4px", color: "#241E1A",
      }}>
        언제 연락하면<br/>좋을까요?
      </h1>
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 18px", letterSpacing: "-0.005em" }}>
        최근 4주의 연락 흐름이에요
      </p>

      <ParentToggle />

      {/* ── 캘린더 ── */}
      <div style={{ background: "#FFFBF2", borderRadius: 20, padding: "16px 14px 14px", marginBottom: 10 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 10,
        }}>
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
            5월
          </span>
          <span style={{ fontSize: "11.5px", color: "#8A6B5C" }}>4월 · 6월</span>
        </div>

        {/* 요일 헤더 */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          fontSize: "11px", color: "#8A6B5C", marginBottom: 4, fontWeight: 500,
        }}>
          {WEEK_LABELS.map((w) => (
            <div key={w} style={{ textAlign: "center" }}>{w}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {MAY_CELLS.map((day, i) => {
            const inMonth = day !== null;
            const hasContact = inMonth && mayContactDays.has(day!);
            const isToday = day === todayDay;
            return (
              <button
                key={i}
                type="button"
                disabled={!inMonth}
                onClick={() =>
                  inMonth &&
                  router.push(`/child/signal/calendar/2026-05-${String(day).padStart(2, "0")}`)
                }
                style={{
                  aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", fontSize: "13px",
                  fontWeight: isToday ? 700 : 400,
                  color: !inMonth ? "#dcd1bb" : "#241E1A",
                  background: "none", border: "none",
                  cursor: inMonth ? "pointer" : "default",
                  padding: 0,
                }}
              >
                {inMonth ? day : ""}
                {/* 연락한 날: 작은 복숭아색 점 */}
                {hasContact && (
                  <div style={{
                    position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: 999, background: "#F6D6BD",
                  }} />
                )}
                {/* 오늘 테두리 */}
                {isToday && (
                  <div style={{
                    position: "absolute", inset: 4,
                    border: "1.5px solid #241E1A", borderRadius: 999,
                    pointerEvents: "none",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: "12.5px", color: "#8A6B5C", lineHeight: 1.5, margin: "0 0 28px" }}>
        표시는 연락한 날이에요. 비어 있어도 괜찮아요.
      </p>

      {/* ── 오늘 기분 ── */}
      <div>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
            오늘 기분은 어때요?
          </span>
          {quickMood !== null && (
            <span style={{ fontSize: "12px", color: "#8A6B5C" }}>
              {MOOD_EMOJIS[quickMood].label}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {MOOD_EMOJIS.map(({ emoji, label }, i) => (
            <button
              key={i}
              type="button"
              aria-label={label}
              onClick={() => setQuickMood(i)}
              style={{
                flex: 1, aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: quickMood === i ? "#F0E7D7" : "#FFFBF2",
                border: quickMood === i ? "2px solid #241E1A" : "1.5px solid #E8DECF",
                borderRadius: 14, fontSize: "22px",
                cursor: "pointer", padding: 0,
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/child/checkin")}
          style={{
            background: "none", border: "none", padding: "14px 0 0",
            fontSize: "12.5px", color: "#8A6B5C",
            cursor: "pointer", width: "100%", textAlign: "center",
            letterSpacing: "-0.005em",
          }}
        >
          자세히 기록하기 →
        </button>
      </div>
    </ChildAppShell>
  );
}
