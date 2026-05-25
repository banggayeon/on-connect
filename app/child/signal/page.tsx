"use client";

import { useRouter } from "next/navigation";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { ParentToggle } from "@/components/child/ParentToggle";
import { SignalCard } from "@/components/SignalCard";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { careMessages, mockCareActions } from "@/lib/mockData";

const MAY_CONTACT_DAYS: Record<string, Record<string, string>> = {
  parent_mother: {
    "1": "#F1D6CC","2": "#F1D6CC","3": "#F1D6CC","4": "#F1D6CC","5": "#F1D6CC",
    "6": "#F1D6CC","7": "#F1D6CC","8": "#CDDCC8","9": "#F1D6CC","10": "#F1D6CC",
    "11": "#F1D6CC","12": "#F1D6CC","13": "#F1D6CC","14": "#F1D6CC","15": "#F1D6CC",
    "16": "#F6D6BD"
  },
  parent_father: {
    "1": "#F6D6BD","2": "#F6D6BD","3": "#F6D6BD","4": "#F6D6BD","5": "#F6D6BD",
    "6": "#F6D6BD","7": "#F6D6BD","8": "#CDDCC8","9": "#F6D6BD","10": "#F6D6BD",
    "11": "#F6D6BD","12": "#F6D6BD","13": "#F6D6BD","14": "#F6D6BD","15": "#F6D6BD",
    "16": "#F6D6BD"
  }
};

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMayCalendar() {
  const firstDay = new Date(2026, 4, 1).getDay();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MAY_CELLS = buildMayCalendar();

export default function ChildSignalPage() {
  const router = useRouter();
  const { selectedParentId } = useSelectedParent();
  const isMom = selectedParentId === "parent_mother";
  const contactDays = MAY_CONTACT_DAYS[selectedParentId] ?? {};

  return (
    <ChildAppShell>
      <header style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>
          {careMessages.screen.eyebrow}
        </p>
        <h1 style={{ fontSize: "26px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
          {careMessages.screen.title}
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {careMessages.screen.description}
        </p>
      </header>

      <ParentToggle />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 안부 캘린더 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>
              5월 안부 캘린더
            </p>
            <span
              style={{
                fontSize: "11px",
                color: "#241E1A",
                background: isMom ? "#F1D6CC" : "#F6D6BD",
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
              <div key={w} style={{ textAlign: "center", fontSize: "10px", color: "#8A6B5C", fontWeight: 500, paddingBottom: "4px" }}>
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
                    border: isToday ? "2px solid #241E1A" : "none",
                    borderRadius: "8px",
                    cursor: day !== null ? "pointer" : "default"
                  }}
                >
                  {day !== null && (
                    <>
                      <span
                        style={{
                          fontSize: "11px",
                          color: hasContact ? "#241E1A" : "#9A8B7D",
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
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>
              {careMessages.parentPromptTitle}
            </p>
            <button
              type="button"
              onClick={() => router.push("/child/signal/recommend")}
              style={{
                fontSize: "12px",
                color: "#3D332C",
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
            background: "#F6D6BD",
            borderRadius: "26px",
            padding: "18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 6px", fontWeight: 500 }}>
            {careMessages.warmReplyAI.label}
          </p>
          <p style={{ fontSize: "16px", color: "#241E1A", margin: "0 0 12px", fontWeight: 600, lineHeight: 1.4 }}>
            {careMessages.warmReplyAI.title}
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: "14px",
              padding: "14px 16px"
            }}
          >
            <p style={{ fontSize: "11px", color: "#6E4A39", margin: "0 0 5px", fontWeight: 500 }}>AI가 다듬은 답장</p>
            <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
              &quot;{careMessages.warmReplyAI.suggestedReply}&quot;
            </p>
          </div>
        </div>

        {/* 첫 대화 시작 도우미 배너 */}
        <button
          type="button"
          onClick={() => router.push("/child/signal/first-contact")}
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#D9D0E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "18px" }}>💬</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 2px", fontWeight: 600 }}>
                첫 대화 시작 도우미
              </p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>
                오랜만에 연락하기 어려우신가요?
              </p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </ChildAppShell>
  );
}
