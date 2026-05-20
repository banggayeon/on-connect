"use client";

import { useState } from "react";
import { ChevronRight, MessageCirclePlus, Send, Umbrella } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { SignalCard } from "@/components/SignalCard";
import { careMessages, demoDataset } from "@/lib/mockData";

const QUICK_REPLY_STYLES = [
  { bg: "#FFE5DA", color: "#8A3E25" },
  { bg: "#E8F3E5", color: "#3A6B3A" },
  { bg: "#FFF1DA", color: "#7A5A1A" },
  { bg: "#E0EDF5", color: "#2C5A7A" }
];

// 5월 안부 캘린더 데이터 (연락한 날 기준)
const MAY_CONTACT_DAYS: Record<string, { color: string; label: string }> = {
  "1": { color: "#E07856", label: "안부" },
  "2": { color: "#E07856", label: "안부" },
  "3": { color: "#E07856", label: "안부" },
  "4": { color: "#E07856", label: "안부" },
  "5": { color: "#E07856", label: "안부" },
  "6": { color: "#E07856", label: "안부" },
  "7": { color: "#E07856", label: "안부" },
  "8": { color: "#7AB87A", label: "안부" },
  "9": { color: "#E07856", label: "안부" },
  "10": { color: "#E07856", label: "안부" },
  "11": { color: "#E07856", label: "안부" },
  "12": { color: "#E07856", label: "안부" },
  "13": { color: "#E07856", label: "안부" },
  "14": { color: "#E07856", label: "안부" },
  "15": { color: "#E07856", label: "안부" },
  "16": { color: "#E8A04E", label: "안부" }
};

const DAD_MAY_CONTACT_DAYS: Record<string, { color: string; label: string }> = {
  "1": { color: "#E8A04E", label: "안부" },
  "2": { color: "#E8A04E", label: "안부" },
  "3": { color: "#E8A04E", label: "안부" },
  "4": { color: "#E8A04E", label: "안부" },
  "5": { color: "#E8A04E", label: "안부" },
  "6": { color: "#E8A04E", label: "안부" },
  "7": { color: "#E8A04E", label: "안부" },
  "8": { color: "#7AB87A", label: "안부" },
  "9": { color: "#E8A04E", label: "안부" },
  "10": { color: "#E8A04E", label: "안부" },
  "11": { color: "#E8A04E", label: "안부" },
  "12": { color: "#E8A04E", label: "안부" },
  "13": { color: "#E8A04E", label: "안부" },
  "14": { color: "#E8A04E", label: "안부" },
  "15": { color: "#E8A04E", label: "안부" },
  "16": { color: "#E8A04E", label: "안부" }
};

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMayCalendar() {
  const firstDay = new Date(2026, 4, 1).getDay(); // 5 = Friday
  const totalDays = 31;
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MAY_CELLS = buildMayCalendar();

export default function ChildSignalPage() {
  const [reply, setReply] = useState(careMessages.latestReply.message);
  const [timeAgo, setTimeAgo] = useState(careMessages.latestReply.timeAgo);
  const [selectedParentId, setSelectedParentId] = useState(demoDataset.parents[0].id);

  const isMom = selectedParentId === demoDataset.parents[0].id;
  const contactDays = isMom ? MAY_CONTACT_DAYS : DAD_MAY_CONTACT_DAYS;
  const accentColor = isMom ? "#E07856" : "#E8A04E";
  const accentBg = isMom ? "#FFE5DA" : "#FFF1DA";
  const bgGradient = isMom
    ? "bg-gradient-to-b from-[#FFF1DA] via-cream-50 to-white"
    : "bg-gradient-to-b from-[#FFF5E8] via-cream-50 to-white";

  function selectReply(nextReply: string) {
    setReply(nextReply);
    setTimeAgo("방금 전");
  }

  return (
    <ChildAppShell className={bgGradient}>
      {/* Header */}
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {demoDataset.parents.map((parent) => {
          const isActive = parent.id === selectedParentId;
          const isMomTab = parent.id === demoDataset.parents[0].id;
          return (
            <button
              key={parent.id}
              type="button"
              onClick={() => setSelectedParentId(parent.id)}
              style={{
                background: isActive
                  ? isMomTab
                    ? "linear-gradient(135deg, #FF8A65, #E07856)"
                    : "linear-gradient(135deg, #E8A04E, #D4883A)"
                  : "white",
                color: isActive ? "white" : "#8A6B5C",
                border: isActive ? "none" : "1.5px solid #F0E4D8",
                borderRadius: "999px",
                padding: "9px 22px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: isActive
                  ? isMomTab
                    ? "0 4px 12px rgba(224,120,86,0.25)"
                    : "0 4px 12px rgba(232,160,78,0.25)"
                  : "none"
              }}
            >
              {parent.displayName}
            </button>
          );
        })}
      </div>

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
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>5월 안부 캘린더</p>
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
            {MAY_CELLS.map((day, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "4px 0"
                }}
              >
                {day !== null && (
                  <>
                    <span
                      style={{
                        fontSize: "11px",
                        color: contactDays[String(day)] ? "#3D2419" : "#C5A898",
                        fontWeight: contactDays[String(day)] ? 600 : 400
                      }}
                    >
                      {day}
                    </span>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: contactDays[String(day)]?.color ?? "transparent",
                        display: "block"
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 안부 시그널 추천 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>
            {careMessages.parentPromptTitle}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {careMessages.suggestions.map((message) => (
              <SignalCard
                key={message.id}
                active={message.active}
                title={message.text}
                subtitle={message.helper}
                tone={message.tone}
              />
            ))}
          </div>
        </div>

        {/* 최근 답장 */}
        <div
          style={{
            background: "#E8F3E5",
            borderRadius: "16px",
            padding: "16px 18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#3A6B3A", margin: "0 0 6px", fontWeight: 500 }}>
            {careMessages.latestReply.title}
          </p>
          <p style={{ fontSize: "17px", color: "#1F4A1F", margin: 0, fontWeight: 600 }}>
            {reply} · {timeAgo}
          </p>
        </div>

        {/* 빠른 답장 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>
            {careMessages.quickReplyTitle}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {careMessages.quickReplies.map((quickReply, index) => {
              const s = QUICK_REPLY_STYLES[index] ?? QUICK_REPLY_STYLES[0];
              return (
                <button
                  key={quickReply}
                  type="button"
                  onClick={() => selectReply(quickReply)}
                  style={{
                    background: s.bg,
                    color: s.color,
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  {quickReply}
                </button>
              );
            })}
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
          <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.4 }}>
            {careMessages.warmReplyAI.title}
          </p>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.55 }}>
            {careMessages.warmReplyAI.reason}
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

        {/* 보내기 버튼 */}
        <button
          type="button"
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${isMom ? "#FF8A65, #E07856" : "#E8A04E, #D4883A"})`,
            color: "white",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: `0 8px 20px ${isMom ? "rgba(224,120,86,0.28)" : "rgba(232,160,78,0.28)"}`
          }}
        >
          <Send size={18} />
          {careMessages.sendButtonLabel}
        </button>

        {/* 날씨 안내 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "14px",
            padding: "14px 16px",
            fontSize: "13px",
            color: "#8A6B5C"
          }}
        >
          <Umbrella size={18} style={{ flexShrink: 0, color: "#7DA8C8" }} />
          {careMessages.weatherNotice}
        </div>

        {/* 첫 대화 시작 도우미 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7AB87A",
                  background: "#E8F3E5",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  marginBottom: "6px"
                }}
              >
                신규 · AI
              </span>
              <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, fontWeight: 500 }}>첫 대화 시작 도우미</p>
            </div>
            <MessageCirclePlus size={20} style={{ color: "#B07A5C", flexShrink: 0, marginTop: "2px" }} />
          </div>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.5 }}>
            오랜만에 연락하기 어려우신가요? 기간에 맞게 자연스럽게 시작할 수 있도록 도와드려요.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "1주일 만", desc: "가벼운 안부로 시작하기" },
              { label: "1개월 만", desc: "근황과 함께 따뜻하게" },
              { label: "3개월 이상", desc: "천천히 다시 연결하기" }
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#FBF6F0",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  cursor: "pointer"
                }}
              >
                <div>
                  <p style={{ fontSize: "13px", color: "#3D2419", margin: "0 0 2px", fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontSize: "11px", color: "#8A6B5C", margin: 0 }}>{item.desc}</p>
                </div>
                <ChevronRight size={14} style={{ color: "#B07A5C" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChildAppShell>
  );
}
