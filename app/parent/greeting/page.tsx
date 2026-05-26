"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";

const TOPICS = [
  { id: "날씨", emoji: "🌤", tone: "#D8E0A6" },
  { id: "산책", emoji: "🚶", tone: "#D9D0E5" },
  { id: "식사", emoji: "🥣", tone: "#CDDCC8" },
  { id: "사진", emoji: "📷", tone: "#F6D6BD" },
  { id: "요즘", emoji: "💬", tone: "#F1D6CC" },
];

const MESSAGES: Record<string, string[]> = {
  날씨: [
    "오늘 날씨가 좋던데, 거기도 그러니? 점심에 잠깐이라도 나가봐.",
    "갑자기 비가 왔어. 우산 있니? 감기 조심해.",
    "요즘 날씨가 오락가락하네. 겉옷 챙겨 다녀.",
  ],
  산책: [
    "요즘 산책할 시간은 있어? 엄마도 아침마다 짧게 걷고 있어.",
    "날씨 좋을 때 잠깐이라도 나가봐. 기분이 달라지더라.",
    "주말에 같이 산책 한번 할까? 가까운 데라도.",
  ],
  식사: [
    "밥은 잘 챙겨 먹고 있어? 끼니 거르지 마.",
    "점심 뭐 먹었어? 엄마는 된장찌개 끓였어.",
    "저녁에 뭐 먹을 거야? 건강하게 잘 챙겨 먹어.",
  ],
  사진: [
    "요즘 사진 찍은 거 있으면 보내줘. 뭐 하고 지내는지 궁금해.",
    "좋은 것 보면 사진 찍어서 공유해줘. 같이 보고 싶다.",
    "주말에 예쁜 거 있으면 사진 찍어서 보내줘.",
  ],
  요즘: [
    "요즘 어떻게 지내? 바쁘지? 잘 지내고 있지?",
    "한동안 연락을 못 했는데, 건강하게 잘 있지?",
    "요즘 어때? 힘든 거 없어? 있으면 말해.",
  ],
};

export default function ParentGreetingPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleTopicSelect(topic: string) {
    setSelectedTopic(topic);
    setSelectedMsg(null);
    setCopied(false);
    setLoading(true);
    setTimeout(() => {
      setMessages(MESSAGES[topic] ?? []);
      setLoading(false);
    }, 500);
  }

  function handleSelect(text: string) {
    setSelectedMsg(text);
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title, 28px)", color: "#241E1A", margin: 0, fontWeight: 700, letterSpacing: "-0.025em" }}>
          안부 추천
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: "0 0 24px", lineHeight: 1.6 }}>
        주제를 고르면 자녀에게 보낼 안부 문장을 만들어드려요.
      </p>

      {/* 주제 칩 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTopicSelect(t.id)}
            style={{
              padding: "14px 22px", borderRadius: 999,
              background: selectedTopic === t.id ? "#241E1A" : t.tone,
              color: selectedTopic === t.id ? "#FBF6EC" : "#241E1A",
              border: "none", cursor: "pointer",
              fontSize: "var(--parent-font-base, 20px)", fontWeight: 600,
              letterSpacing: "-0.012em",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {t.emoji} {t.id}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: "#8A6B5C", textAlign: "center", padding: "20px 0", fontSize: "var(--parent-font-caption, 15px)" }}>
          추천 문장을 만드는 중…
        </p>
      )}

      {!loading && messages.length > 0 && (
        <>
          <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: "0 0 14px" }}>
            마음에 드는 문장을 눌러 복사하세요.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(msg)}
                style={{
                  background: selectedMsg === msg ? "#F1E5C8" : "#FFFBF2",
                  border: selectedMsg === msg ? "2px solid #6E4A39" : "1.5px solid #E8DECF",
                  borderRadius: 22, padding: "20px 22px",
                  fontSize: "var(--parent-font-base, 20px)", color: "#241E1A",
                  cursor: "pointer", textAlign: "left", fontWeight: 500, lineHeight: 1.55,
                  width: "100%", display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <span>{msg}</span>
                <span style={{
                  fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C",
                  background: "#F0E7D7", borderRadius: 999, padding: "4px 12px",
                  alignSelf: "flex-start",
                }}>
                  눌러서 복사하기
                </span>
              </button>
            ))}
          </div>

          {copied && (
            <div style={{
              marginTop: 16, background: "#CDDCC8", borderRadius: 18, padding: "18px",
              fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", textAlign: "center",
            }}>
              복사됐어요! 카카오톡에 붙여넣기 하세요.
            </div>
          )}
        </>
      )}

      <p style={{ fontSize: "13px", color: "#8A6B5C", textAlign: "center", margin: "32px 0 0", lineHeight: 1.6 }}>
        자녀가 직접 공유하지 않은 정보는 사용하지 않아요
      </p>
    </ParentAppShell>
  );
}
