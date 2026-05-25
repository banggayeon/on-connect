"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChildAppShell } from "@/components/child/ChildAppShell";

const MOOD_OPTIONS = [
  { emoji: "😄", label: "아주 좋아요" },
  { emoji: "🙂", label: "좋아요" },
  { emoji: "😐", label: "보통이에요" },
  { emoji: "😔", label: "별로예요" },
  { emoji: "😢", label: "안 좋아요" },
];

const MOOD_TO_EMOTIONS: Record<number, string[]> = {
  0: ["감사한", "뿌듯한", "설레는", "기쁜", "활기찬"],
  1: ["평온한", "만족스러운", "여유로운", "따뜻한"],
  2: ["그냥 그런", "피곤한", "무덤덤한", "담담한"],
  3: ["아쉬운", "걱정되는", "외로운", "지친"],
  4: ["힘든", "슬픈", "불안한", "속상한", "외로운"],
};

const HEALTH_OPTIONS = [
  { emoji: "💪", label: "아주 좋아요" },
  { emoji: "👍", label: "좋아요" },
  { emoji: "🤔", label: "보통이에요" },
  { emoji: "🤕", label: "좀 안 좋아요" },
  { emoji: "🏥", label: "많이 안 좋아요" },
];

export default function ChildCheckinPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join("");
      setMemo(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function handleMoodSelect(i: number) {
    setSelectedMood(i);
    setSelectedEmotion(null);
  }

  function handleSave() {
    if (selectedMood === null || selectedHealth === null) return;
    try {
      localStorage.setItem("child_checkin_latest", JSON.stringify({
        mood: selectedMood,
        emotion: selectedEmotion,
        health: selectedHealth,
        memo,
        savedAt: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => router.back(), 1600);
  }

  const canSave = selectedMood !== null && selectedHealth !== null;

  return (
    <ChildAppShell>
      {/* ── 헤더 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}
          aria-label="뒤로가기"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#241E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{
          fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em",
          color: "#241E1A", margin: 0,
        }}>
          오늘의 기록
        </h1>
      </div>
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 28px", letterSpacing: "-0.005em" }}>
        나만 볼 수 있어요
      </p>

      {/* ── 기분 ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", margin: "0 0 14px", letterSpacing: "-0.015em" }}>
          오늘 기분은 어때요?
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {MOOD_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMoodSelect(i)}
              aria-label={opt.label}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "10px 4px",
                background: selectedMood === i ? "#241E1A" : "#FFFBF2",
                border: selectedMood === i ? "none" : "1.5px solid #E8DECF",
                borderRadius: 14, cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "24px" }}>{opt.emoji}</span>
              <span style={{
                fontSize: "10.5px", lineHeight: 1.3, textAlign: "center",
                color: selectedMood === i ? "#FBF6EC" : "#6E4A39",
                fontWeight: selectedMood === i ? 600 : 400,
              }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 감정 세분화 ── */}
      {selectedMood !== null && (
        <div style={{ marginBottom: 24, animation: "fadeIn 0.2s ease-out" }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }`}</style>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", margin: "0 0 4px", letterSpacing: "-0.015em" }}>
            조금 더 구체적으로 말하면?
          </p>
          <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 12px" }}>선택 안 해도 괜찮아요</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(MOOD_TO_EMOTIONS[selectedMood] ?? []).map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
                style={{
                  padding: "9px 16px", borderRadius: 999,
                  background: selectedEmotion === emotion ? "#241E1A" : "#F0E7D7",
                  color: selectedEmotion === emotion ? "#FBF6EC" : "#3D332C",
                  border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: selectedEmotion === emotion ? 600 : 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 몸 상태 ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", margin: "0 0 14px", letterSpacing: "-0.015em" }}>
          몸 상태는 어때요?
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {HEALTH_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedHealth(i)}
              aria-label={opt.label}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "10px 4px",
                background: selectedHealth === i ? "#241E1A" : "#FFFBF2",
                border: selectedHealth === i ? "none" : "1.5px solid #E8DECF",
                borderRadius: 14, cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "24px" }}>{opt.emoji}</span>
              <span style={{
                fontSize: "10.5px", lineHeight: 1.3, textAlign: "center",
                color: selectedHealth === i ? "#FBF6EC" : "#6E4A39",
                fontWeight: selectedHealth === i ? 600 : 400,
              }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 메모 ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", margin: "0 0 4px", letterSpacing: "-0.015em" }}>
          더 하고 싶은 말이 있어요?
          <span style={{ fontSize: "12px", color: "#8A6B5C", fontWeight: 400, marginLeft: 6 }}>선택사항</span>
        </p>
        <div style={{ position: "relative", marginTop: 10 }}>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 어땠나요?"
            style={{
              width: "100%", minHeight: "100px", fontSize: "15px",
              border: "1.5px solid #E8DECF", borderRadius: 16,
              padding: "14px", paddingRight: speechSupported ? "52px" : "14px",
              resize: "none", outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", color: "#241E1A", lineHeight: 1.6,
              background: "#FFFBF2",
            }}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? "음성 입력 중지" : "음성으로 입력"}
              style={{
                position: "absolute", right: 10, bottom: 10,
                width: 38, height: 38, borderRadius: 999,
                background: listening ? "#241E1A" : "#F0E7D7",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", color: listening ? "#FBF6EC" : "#3D332C",
              }}
            >
              {listening ? "🔇" : "🎙"}
            </button>
          )}
        </div>
        {listening && (
          <p style={{ fontSize: "12.5px", color: "#6E4A39", margin: "8px 0 0", textAlign: "center" }}>
            듣고 있어요…
          </p>
        )}
      </div>

      {/* ── 저장 ── */}
      {saved ? (
        <div style={{
          textAlign: "center", padding: "18px",
          background: "#CDDCC8", borderRadius: 999, marginBottom: 12,
        }}>
          <span style={{ fontSize: "15px", color: "#241E1A", fontWeight: 700 }}>기록했어요! ✓</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: "100%", padding: "18px 22px",
            background: canSave ? "#241E1A" : "#E8DECF",
            color: canSave ? "#FBF6EC" : "#A89B8C",
            border: "none", borderRadius: 999,
            fontSize: "15px", fontWeight: 700, cursor: canSave ? "pointer" : "default",
            letterSpacing: "-0.01em", marginBottom: 12,
          }}
        >
          오늘 기록 완료
        </button>
      )}
    </ChildAppShell>
  );
}
