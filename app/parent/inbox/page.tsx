"use client";

import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, mockInbox } from "@/lib/mockData";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export default function ParentInboxPage() {
  const router = useRouter();

  return (
    <ParentAppShell>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#241E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#241E1A", margin: 0, fontWeight: 700, letterSpacing: "-0.03em" }}>
          받은 안부
        </h1>
      </div>

      {mockInbox.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8A6B5C" }}>
          <p style={{ fontSize: "var(--parent-font-base)" }}>
            아직 받은 안부가 없어요.<br />{childProfile.name}이가 곧 보내줄 거예요!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mockInbox.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => router.push(`/parent/inbox/${entry.id}`)}
              style={{
                width: "100%", textAlign: "left",
                background: "#FFFBF2", borderRadius: "26px", padding: "20px",
                border: "1px solid #E8DECF", cursor: "pointer",
                display: "flex", gap: "12px", alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "8px", height: "8px", borderRadius: "50%", marginTop: "8px", flexShrink: 0,
                  background: entry.read ? "transparent" : "#F1D6CC",
                  border: entry.read ? "none" : "2px solid #6E4A39",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: "0 0 4px" }}>
                  {formatDate(entry.date)} · {entry.senderName}
                </p>
                <p
                  style={{
                    fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, fontWeight: entry.read ? 400 : 600,
                    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                    lineHeight: 1.5,
                  }}
                >
                  {entry.text}
                </p>
                {entry.reaction && (
                  <p style={{ fontSize: "var(--parent-font-caption)", color: "#6E4A39", margin: "6px 0 0" }}>
                    {entry.reaction === "thanks" ? "고마워 💛" : entry.reaction === "miss" ? "보고싶다 🤗" : "잘했네 👏"} 전달함
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </ParentAppShell>
  );
}
