"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, mockInbox } from "@/lib/mockData";

const MOOD_EMOJIS: { emoji: string; label: string }[] = [
  { emoji: "😄", label: "아주 좋아요" },
  { emoji: "🙂", label: "좋아요" },
  { emoji: "😐", label: "보통이에요" },
  { emoji: "😔", label: "조금 힘들어요" },
  { emoji: "😢", label: "힘들어요" },
];

type StoredCheckIn = {
  message: string;
  senderName: string;
  timestamp: string;
  recipientId: string;
  recipientName: string;
};

const MOCK_QUICK_REPLIES = [
  { id: "qr-1", text: "응, 잘 있어~ 거기는 어때?",          label: "짧게" },
  { id: "qr-2", text: "연락해줘서 기분 좋다 😊 나도 잘 지내고 있어!", label: "따뜻하게" },
  { id: "qr-3", text: "걱정 마~ 잘 있어. 너도 건강하게 지내!", label: "안심" },
];

const COMM_TOOLS = [
  { key: "flow",     icon: "📬", accent: "#F1E5C8", title: "연결 흐름",    desc: "주고받은 안부 기록 보기",        href: "/parent/inbox" },
  { key: "greeting", icon: "✉️", accent: "#D8E0A6", title: "안부 추천",    desc: "AI가 자녀에게 보낼 문장을 만들어요", href: "/parent/greeting" },
  { key: "reply",    icon: "✍️", accent: "#D9D0E5", title: "말 다듬기",    desc: "하고 싶은 말을 부드럽게 바꿔드려요", href: "/parent/reply" },
  { key: "briefing", icon: "📋", accent: "#CDDCC8", title: "대화 전 브리핑", desc: "연락하기 전 알아두면 좋을 흐름",   href: "/parent/briefing" },
  { key: "report",   icon: "📊", accent: "#F1D6CC", title: "관계 리포트",  desc: "대화 흐름과 주제 한눈에 보기",    href: "/parent/report" },
];

function ArrowIcon({ color = "#FBF6EC", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ParentHomePage() {
  const router = useRouter();
  const [quickMood, setQuickMood] = useState<number | null>(null);
  const [receivedCheckIn, setReceivedCheckIn] = useState<StoredCheckIn | null>(null);
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const [checkInReplied, setCheckInReplied] = useState(false);

  const unreadInbox = mockInbox.filter((e) => !e.read);
  const latestInbox = mockInbox[0];
  const childName = childProfile.name;
  const parentName = "어머니";

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    month: "long", day: "numeric", weekday: "long",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("onconnect_sent_checkin");
      if (raw) setReceivedCheckIn(JSON.parse(raw) as StoredCheckIn);
    } catch { /* ignore */ }
  }, []);

  function handleQuickReply(text: string) {
    setSelectedReply(text);
    setTimeout(() => setCheckInReplied(true), 500);
  }

  // ── Hero content ─────────────────────────────────────────────────────────────

  const heroBarColor =
    receivedCheckIn && !checkInReplied ? "#F6D6BD"
    : checkInReplied ? "#CDDCC8"
    : "#D8E0A6";

  return (
    <ParentAppShell>
      {/* ── 헤더 ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: 0, fontWeight: 500, letterSpacing: "-0.005em" }}>
          {todayStr}
        </p>
        <button
          type="button"
          onClick={() => router.push("/parent/settings")}
          aria-label="설정"
          style={{
            width: 46, height: 46, borderRadius: 999,
            border: "1px solid #E8DECF", background: "#FFFBF2",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "var(--parent-font-caption, 15px)", fontWeight: 600,
            color: "#241E1A", cursor: "pointer",
          }}
        >
          설정
        </button>
      </div>

      <h1 style={{
        fontSize: "var(--parent-font-title, 34px)", color: "#241E1A",
        margin: "16px 0 28px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em",
      }}>
        안녕하세요,<br/>{parentName}!
      </h1>

      {/* ── 히어로 섹션 ── */}
      <div style={{ position: "relative", paddingLeft: 20, marginBottom: 32 }}>
        {/* 왼쪽 액센트 바 */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 4, borderRadius: 999, background: heroBarColor,
        }} />

        {/* (A) 받은 안부 — 미답장 */}
        {receivedCheckIn && !checkInReplied && (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 999,
                background: "#F6D6BD",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "var(--parent-font-base, 20px)", fontWeight: 700, color: "#241E1A", flexShrink: 0,
              }}>
                {receivedCheckIn.senderName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: "var(--parent-font-base, 18px)", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.015em" }}>
                  {receivedCheckIn.senderName}
                </div>
                <div style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C" }}>방금 · 안부</div>
              </div>
              <span style={{
                marginLeft: "auto", fontSize: "var(--parent-font-caption, 13px)",
                color: "#6E4A39", fontWeight: 700,
                background: "#F6D6BD", padding: "5px 12px", borderRadius: 999,
                letterSpacing: "-0.005em", flexShrink: 0,
              }}>
                답장 대기
              </span>
            </div>

            <p style={{
              fontSize: "var(--parent-font-title, 26px)", fontWeight: 600,
              lineHeight: 1.45, letterSpacing: "-0.025em",
              color: "#241E1A", margin: "0 0 6px",
            }}>
              "{receivedCheckIn.message}"
            </p>
            <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
              짧게 답해도 괜찮아요.
            </p>

            {/* 빠른 답장 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
              {MOCK_QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => handleQuickReply(reply.text)}
                  style={{
                    background: selectedReply === reply.text ? "#F1E5C8" : "#FFFBF2",
                    border: selectedReply === reply.text ? "2px solid #6E4A39" : "1.5px solid #E8DECF",
                    borderRadius: 16, padding: "16px 18px",
                    fontSize: "var(--parent-font-base, 18px)", color: "#241E1A",
                    cursor: "pointer", textAlign: "left", fontWeight: 500, lineHeight: 1.4,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <span>{reply.text}</span>
                  <span style={{
                    flexShrink: 0, fontSize: "var(--parent-font-caption, 13px)",
                    color: "#8A6B5C", background: "#F0E7D7",
                    padding: "3px 10px", borderRadius: 999,
                  }}>
                    {reply.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => router.push(`/parent/inbox/${latestInbox.id}`)}
              style={{
                width: "100%", background: "transparent",
                border: "1.5px solid #E8DECF", borderRadius: 999,
                padding: "16px 20px",
                fontSize: "var(--parent-font-caption, 15px)", color: "#6E4A39",
                cursor: "pointer", fontWeight: 600, letterSpacing: "-0.01em",
              }}
            >
              직접 쓸게요
            </button>
          </>
        )}

        {/* (B) 답장 완료 */}
        {checkInReplied && (
          <>
            <p style={{
              fontSize: "var(--parent-font-caption, 15px)", fontWeight: 700, color: "#3D6B47",
              margin: "0 0 8px", letterSpacing: "-0.01em",
            }}>
              답장을 보냈어요!
            </p>
            <p style={{
              fontSize: "var(--parent-font-base, 20px)", color: "#241E1A",
              margin: 0, lineHeight: 1.5, letterSpacing: "-0.02em",
            }}>
              "{selectedReply}"
            </p>
          </>
        )}

        {/* (C) 받은 안부 없을 때 — 최신 inbox */}
        {!receivedCheckIn && (
          <>
            <p style={{
              fontSize: "var(--parent-font-caption, 14px)", fontWeight: 700, color: "#6E4A39",
              margin: "0 0 10px", letterSpacing: "-0.005em",
            }}>
              {unreadInbox.length > 0 ? `${childName}이가 안부를 보냈어요` : "오늘 보내기 좋은 안부"}
            </p>
            {unreadInbox.length > 0 ? (
              <p style={{
                fontSize: "var(--parent-font-title, 28px)", fontWeight: 600,
                lineHeight: 1.45, letterSpacing: "-0.025em",
                color: "#241E1A", margin: "0 0 20px",
              }}>
                "{latestInbox.text}"
              </p>
            ) : (
              <>
                <p style={{
                  fontSize: "var(--parent-font-title, 24px)", fontWeight: 600,
                  lineHeight: 1.45, letterSpacing: "-0.025em",
                  color: "#241E1A", margin: "0 0 8px",
                }}>
                  날씨와 평소 대화 흐름을<br/>참고해서 안부를 만들어드려요.
                </p>
                <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
                  버튼을 눌러 먼저 안부를 건네보세요.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={() => router.push(`/parent/inbox/${latestInbox.id}`)}
              style={{
                width: "100%", background: "#241E1A", color: "#FBF6EC",
                border: "none", borderRadius: 999,
                padding: "20px 26px",
                fontSize: "var(--parent-font-base, 18px)", fontWeight: 600,
                cursor: "pointer", letterSpacing: "-0.012em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {unreadInbox.length > 0 ? "답장 보내기" : "안부 보내기"}
              <ArrowIcon />
            </button>
          </>
        )}
      </div>

      {/* ── 오늘 기분 ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: "var(--parent-font-base, 18px)", fontWeight: 700,
          color: "#241E1A", margin: "0 0 16px", letterSpacing: "-0.015em",
        }}>
          오늘 기분은 어떠세요?
        </p>
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
                background: quickMood === i ? "#F1E5C8" : "#FFFBF2",
                border: quickMood === i ? "2.5px solid #6E4A39" : "1.5px solid #E8DECF",
                borderRadius: 16,
                fontSize: "var(--parent-font-title, 28px)",
                cursor: "pointer",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        {quickMood !== null && (
          <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", textAlign: "center", margin: "12px 0 0" }}>
            {MOOD_EMOJIS[quickMood].label} · 기록했어요
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push("/parent/checkin")}
          style={{
            background: "none", border: "none", padding: "12px 0 0",
            fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C",
            cursor: "pointer", width: "100%", textAlign: "center", letterSpacing: "-0.01em",
          }}
        >
          자세히 기록하기 →
        </button>
      </div>

      {/* ── 소통 도움 ── */}
      <div style={{ marginBottom: 8 }}>
        <p style={{
          fontSize: "var(--parent-font-base, 18px)", fontWeight: 700,
          color: "#241E1A", margin: "0 0 14px", letterSpacing: "-0.015em",
        }}>
          소통 도움
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {COMM_TOOLS.map((item, idx) => (
            <button
              key={item.key}
              type="button"
              onClick={() => router.push(item.href)}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 0", background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
                borderBottom: idx < COMM_TOOLS.length - 1 ? "1px solid #F0E7D7" : "none",
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 16,
                background: item.accent, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px",
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--parent-font-base, 18px)", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.015em" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", marginTop: 3, letterSpacing: "-0.005em" }}>
                  {item.desc}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </ParentAppShell>
  );
}
