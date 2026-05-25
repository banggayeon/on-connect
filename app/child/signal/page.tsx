"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, MessageCirclePlus } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { ParentToggle } from "@/components/child/ParentToggle";
import { SignalCard } from "@/components/SignalCard";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { careMessages, mockCareActions } from "@/lib/mockData";
import { demoDataset } from "@/lib/demoDataset";

// 5월 연락 날짜 맵 (parentId → set of day strings)
const MAY_CONTACT_DAYS: Record<string, Record<string, string>> = {
  parent_mother: {
    "1": "#E07856","2": "#E07856","3": "#E07856","4": "#E07856","5": "#E07856",
    "6": "#E07856","7": "#E07856","8": "#7AB87A","9": "#E07856","10": "#E07856",
    "11": "#E07856","12": "#E07856","13": "#E07856","14": "#E07856","15": "#E07856",
    "16": "#E8A04E"
  },
  parent_father: {
    "1": "#E8A04E","2": "#E8A04E","3": "#E8A04E","4": "#E8A04E","5": "#E8A04E",
    "6": "#E8A04E","7": "#E8A04E","8": "#7AB87A","9": "#E8A04E","10": "#E8A04E",
    "11": "#E8A04E","12": "#E8A04E","13": "#E8A04E","14": "#E8A04E","15": "#E8A04E",
    "16": "#E8A04E"
  }
};

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMayCalendar() {
  const firstDay = new Date(2026, 4, 1).getDay(); // 5 = Friday
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MAY_CELLS = buildMayCalendar();

export default function ChildSignalPage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();
  const isMom = selectedParentId === "parent_mother";
  const contactDays = MAY_CONTACT_DAYS[selectedParentId] ?? {};
  const accentColor = isMom ? "#E07856" : "#E8A04E";
  const accentBg = isMom ? "#FFE5DA" : "#FFF1DA";
  const bgGradient = isMom
    ? "bg-gradient-to-b from-[#FFF1DA] via-cream-50 to-white"
    : "bg-gradient-to-b from-[#FFF5E8] via-cream-50 to-white";

  const signals = mockCareActions.filter((a) => a.parentId === selectedParentId && a.type === "message");

  return (
    <ChildAppShell className={bgGradient}>
      <header style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>
          {careMessages.screen.eyebrow}
        </p>
        <h1 style={{ fontSize: "24px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>
          {careMessages.screen.title}
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {careMessages.screen.description}
        </p>
      </header>

      {/* 부모 토글 */}
      <ParentToggle />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 안부 캘린더 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>
              5월 안부 캘린더
            </p>
            <span
              style={{
                fontSize: "11px",
                color: accentColor,
                background: accentBg,
                padding: "3px 10px",
                borderRadius: "999px",
                fontWeight: 500
              }}
            >
              {Object.keys(contactDays).length}일 연락
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {WEEK_LABELS.map((w) => (
              <div key={w} style={{ textAlign: "center", fontSize: "10px", color: "#B07A5C", fontWeight: 500, paddingBottom: "4px" }}>
                {w}
              </div>
            ))}
            {MAY_CELLS.map((day, i) => {
              const hasContact = day !== null && !!contactDays[String(day)];
              const isToday = day === 20;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={day === null}
                  onClick={() =>
                    day !== null &&
                    router.push(`/child/signal/calendar/2026-05-${String(day).padStart(2, "0")}`)
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    padding: "4px 0",
                    background: "none",
                    border: isToday ? `2px solid ${accentColor}` : "none",
                    borderRadius: "8px",
                    cursor: day !== null ? "pointer" : "default"
                  }}
                >
                  {day !== null && (
                    <>
                      <span
                        style={{
                          fontSize: "11px",
                          color: hasContact ? "#3D2419" : "#C5A898",
                          fontWeight: hasContact ? 600 : 400
                        }}
                      >
                        {day}
                      </span>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: hasContact ? contactDays[String(day)] : "transparent",
                          display: "block"
                        }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 안부 시그널 추천 미리보기 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>
              {careMessages.parentPromptTitle}
            </p>
            <button
              type="button"
              onClick={() => router.push("/child/signal/recommend")}
              style={{
                fontSize: "12px",
                color: accentColor,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0
              }}
            >
              전체 보기
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {careMessages.suggestions.slice(0, 2).map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => router.push(`/child/signal/recommend/${message.id}`)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
              >
                <SignalCard
                  active={message.active}
                  title={message.text}
                  subtitle={message.helper}
                  tone={message.tone}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Warm Reply AI */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFE5DA, #FFF1DA)",
            borderRadius: "18px",
            padding: "18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 6px", fontWeight: 500 }}>
            {careMessages.warmReplyAI.label}
          </p>
          <p style={{ fontSize: "16px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
            {careMessages.warmReplyAI.title}
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              borderRadius: "14px",
              padding: "14px 16px"
            }}
          >
            <p style={{ fontSize: "11px", color: "#B07A5C", margin: "0 0 5px", fontWeight: 500 }}>AI가 다듬은 답장</p>
            <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>
              &quot;{careMessages.warmReplyAI.suggestedReply}&quot;
            </p>
          </div>
        </div>

        {/* 첫 대화 시작 도우미 배너 */}
        <button
          type="button"
          onClick={() => router.push("/child/signal/first-contact")}
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <MessageCirclePlus size={20} style={{ color: "#B07A5C", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
                첫 대화 시작 도우미
              </p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>
                오랜만에 연락하기 어려우신가요?
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "#B07A5C", flexShrink: 0 }} />
        </button>
      </div>
    </ChildAppShell>
  );
}
