"use client";

import { useState } from "react";
import { Send, Umbrella } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { SignalCard } from "@/components/SignalCard";
import { careMessages } from "@/lib/mockData";

const QUICK_REPLY_STYLES = [
  { bg: "#FFE5DA", color: "#8A3E25" },
  { bg: "#E8F3E5", color: "#3A6B3A" },
  { bg: "#FFF1DA", color: "#7A5A1A" },
  { bg: "#E0EDF5", color: "#2C5A7A" }
];

export default function ChildSignalPage() {
  const [reply, setReply] = useState(careMessages.latestReply.message);
  const [timeAgo, setTimeAgo] = useState(careMessages.latestReply.timeAgo);

  function selectReply(nextReply: string) {
    setReply(nextReply);
    setTimeAgo("방금 전");
  }

  return (
    <ChildAppShell className="bg-gradient-to-b from-[#FFF1DA] via-cream-50 to-white">
      {/* Header */}
      <header style={{ marginBottom: "20px" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 안부 목록 */}
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
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
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
            boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
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
      </div>
    </ChildAppShell>
  );
}
