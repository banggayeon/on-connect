"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "loading" | "ready" | "sent";

interface WeatherInfo {
  condition: string;
  temperature: number;
  checkInHint?: string;
}

interface GreetingModalProps {
  topic: string | null;
  parentId: string;
  incomingMessage?: string;
  onClose: () => void;
}

const TOPIC_LABELS: Record<string, string> = {
  날씨: "날씨", 산책: "산책", 식사: "식사",
  사진: "사진", 요즘: "요즘", 답장: "답장",
};

const PARENTS = [
  { id: "parent_mother", label: "엄마", tone: "#F1D6CC", char: "엄" },
  { id: "parent_father", label: "아빠", tone: "#F1E5C8", char: "아" },
] as const;

type ParentId = (typeof PARENTS)[number]["id"];

function weatherEmoji(condition: string): string {
  if (condition === "맑음") return "☀️";
  if (condition === "대체로 맑음") return "🌤";
  if (condition.includes("소나기")) return "🌦";
  if (condition.includes("비") || condition.includes("가랑비")) return "🌧";
  if (condition.includes("눈")) return "🌨";
  if (condition.includes("뇌우")) return "⛈";
  if (condition.includes("안개")) return "🌫";
  return "⛅";
}

export function GreetingModal({ topic, parentId, incomingMessage, onClose }: GreetingModalProps) {
  const [activeParentId, setActiveParentId] = useState<ParentId>(
    (parentId as ParentId) ?? "parent_mother"
  );
  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState("");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [sentToLabel, setSentToLabel] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isOpen = topic !== null;

  async function fetchGreeting(currentTopic: string, pid: ParentId) {
    setPhase("loading");
    setMessage("");
    try {
      const res = await fetch("/api/ai/topic-greeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: currentTopic, parentId: pid, incomingMessage }),
      });
      const data = await res.json();
      setMessage(data.message ?? "");
      setWeather(data.weather ?? null);
      setPhase("ready");
    } catch {
      setMessage("안부 메시지를 불러오지 못했어요. 다시 시도해 주세요.");
      setPhase("ready");
    }
  }

  // 모달이 열릴 때 초기 부모 동기화 + 메시지 fetch
  useEffect(() => {
    if (!isOpen || !topic) return;
    const pid = (parentId as ParentId) ?? "parent_mother";
    setActiveParentId(pid);
    fetchGreeting(topic, pid);
  }, [topic, parentId]);

  // 수신자 전환 시 메시지 재생성
  function handleParentSwitch(pid: ParentId) {
    if (pid === activeParentId || phase === "sent") return;
    setActiveParentId(pid);
    if (topic) fetchGreeting(topic, pid);
  }

  useEffect(() => {
    if (phase === "ready" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [phase, message]);

  function handleSend() {
    if (phase !== "ready") return;
    const label = PARENTS.find((p) => p.id === activeParentId)?.label ?? "";
    setSentToLabel(label);
    try {
      const key = `sent_${activeParentId}_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify({ topic, message, sentAt: new Date().toISOString() }));
    } catch { /* ignore */ }
    setPhase("sent");
  }

  function handleClose() {
    setPhase("loading");
    setMessage("");
    setWeather(null);
    setSentToLabel("");
    onClose();
  }

  if (!isOpen) return null;

  const activeParent = PARENTS.find((p) => p.id === activeParentId) ?? PARENTS[0];
  const showWeatherPill = weather && (topic === "날씨" || topic === "산책");

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(36, 30, 26, 0.45)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FBF6EC",
          borderRadius: "24px 24px 0 0",
          padding: "28px 22px 40px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 999, background: "#DDD5C5",
          margin: "0 auto 22px",
        }} />

        {/* ── 수신자 선택 ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontSize: "11.5px", color: "#8A6B5C", fontWeight: 600,
            letterSpacing: "-0.005em", margin: "0 0 10px",
          }}>
            누구에게 보낼까요?
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {PARENTS.map((p) => {
              const active = p.id === activeParentId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleParentSwitch(p.id)}
                  disabled={phase === "sent"}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 999,
                    background: active ? p.tone : "#F0E7D7",
                    border: active ? `2px solid ${p.id === "parent_mother" ? "#D4A89A" : "#C9B47A"}` : "2px solid transparent",
                    cursor: phase === "sent" ? "default" : "pointer",
                    fontSize: "14px", fontWeight: active ? 700 : 500,
                    color: "#241E1A", letterSpacing: "-0.01em",
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 999,
                    background: active ? "rgba(36,30,26,0.12)" : "rgba(36,30,26,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 800, color: "#241E1A", flexShrink: 0,
                  }}>
                    {p.char}
                  </div>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {phase === "loading" && (
          <div style={{ padding: "36px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <LoadingSpinner />
            <span style={{ fontSize: "14px", color: "#8A6B5C", letterSpacing: "-0.01em" }}>
              {activeParent.label}에게 보낼 {TOPIC_LABELS[topic ?? ""] ?? topic} 안부를 만들고 있어요…
            </span>
          </div>
        )}

        {phase === "ready" && (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
                {activeParent.label}에게 · {TOPIC_LABELS[topic ?? ""] ?? topic} 안부
              </span>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "20px", color: "#8A6B5C", padding: "4px", lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Weather pill */}
            {showWeatherPill && weather && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#F0E7D7", borderRadius: 999, padding: "6px 12px",
                fontSize: "12.5px", color: "#6E4A39", marginBottom: 14,
                fontWeight: 500, letterSpacing: "-0.005em",
              }}>
                <span>{weatherEmoji(weather.condition)}</span>
                <span>서울 {weather.temperature}°C · {weather.condition}</span>
              </div>
            )}

            {/* Editable message */}
            <div style={{
              background: "#FFFBF2", borderRadius: 16,
              border: "1.5px solid #E8DECF",
              padding: "14px 16px", marginBottom: 14,
            }}>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                style={{
                  width: "100%", background: "none", border: "none", outline: "none",
                  resize: "none", fontFamily: "inherit",
                  fontSize: "16px", lineHeight: 1.6, color: "#241E1A",
                  letterSpacing: "-0.015em", fontWeight: 400, overflow: "hidden",
                }}
                rows={3}
              />
            </div>

            {/* Hint */}
            {weather?.checkInHint && (
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 18px", letterSpacing: "-0.005em", lineHeight: 1.5 }}>
                {weather.checkInHint}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => fetchGreeting(topic!, activeParentId)}
                style={{
                  flex: 1, background: "#F0E7D7", border: "none",
                  borderRadius: 999, padding: "15px 18px",
                  fontSize: "14px", fontWeight: 600, color: "#6E4A39",
                  cursor: "pointer", letterSpacing: "-0.01em",
                }}
              >
                다시 추천받기
              </button>
              <button
                type="button"
                onClick={handleSend}
                style={{
                  flex: 2, background: "#241E1A", border: "none",
                  borderRadius: 999, padding: "15px 18px",
                  fontSize: "14px", fontWeight: 600, color: "#FBF6EC",
                  cursor: "pointer", letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {activeParent.label}에게 보내기
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="#FBF6EC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {phase === "sent" && (
          <div style={{ padding: "24px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: activeParent.tone,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px",
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.02em", marginBottom: 6 }}>
                {sentToLabel}에게 보냈어요!
              </div>
              <div style={{ fontSize: "13px", color: "#8A6B5C", lineHeight: 1.5, letterSpacing: "-0.005em" }}>
                안부가 잘 전달되길 바라요.
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              style={{
                marginTop: 8, background: "#241E1A", border: "none",
                borderRadius: 999, padding: "14px 40px",
                fontSize: "15px", fontWeight: 600, color: "#FBF6EC",
                cursor: "pointer", letterSpacing: "-0.01em",
              }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 999,
      border: "3px solid #E8DECF",
      borderTopColor: "#6E4A39",
      animation: "spin 0.9s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
