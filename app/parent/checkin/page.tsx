"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, defaultConsent } from "@/lib/mockData";
import type { ConsentSettings } from "@/lib/mockData";

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

export default function ParentCheckinPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>(defaultConsent);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);

    try {
      const saved = localStorage.getItem("parentConsent");
      if (saved) setConsent(JSON.parse(saved));
    } catch {}
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isShared = consent.healthShare || consent.moodShare;

  return (
    <ParentAppShell>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#241E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#241E1A", margin: 0, fontWeight: 700, letterSpacing: "-0.03em" }}>
          오늘의 기록
        </h1>
      </div>

      {/* 공유 상태 안내 */}
      <div
        style={{
          background: isShared ? "#CDDCC8" : "#F0E7D7",
          borderRadius: "999px", padding: "10px 16px", marginBottom: "24px",
        }}
      >
        <p style={{ fontSize: "var(--parent-font-caption)", color: "#241E1A", margin: 0 }}>
          {isShared ? `📢 이 기록은 ${childProfile.name}이와 공유돼요` : "🔒 이 기록은 나만 볼 수 있어요"}
        </p>
      </div>

      {/* 기분 체크 */}
      <div style={{ background: "#FFFBF2", borderRadius: "26px", padding: "20px", marginBottom: "16px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 16px", fontWeight: 600 }}>
          오늘 기분이 어떠세요?
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {MOOD_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMoodSelect(i)}
              style={{
                background: selectedMood === i ? "#241E1A" : "#FAF6EE",
                border: "none",
                borderRadius: "18px", padding: "8px 4px",
                minHeight: "var(--parent-btn-height)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                minWidth: "52px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{opt.emoji}</span>
              <span style={{ fontSize: "var(--parent-font-caption)", color: selectedMood === i ? "#FBF6EC" : "#6E4A39", lineHeight: 1.2, textAlign: "center" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 감정 세분화 */}
      {selectedMood !== null && (
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid #E8DECF",
            animation: "slideIn 0.25s ease-out"
          }}
        >
          <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 6px", fontWeight: 600 }}>
            조금 더 구체적으로 말해보면?
          </p>
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: "0 0 14px" }}>
            선택 안 해도 괜찮아요
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(MOOD_TO_EMOTIONS[selectedMood] ?? []).map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
                style={{
                  background: selectedEmotion === emotion ? "#241E1A" : "#F0E7D7",
                  color: selectedEmotion === emotion ? "#FBF6EC" : "#3D332C",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "var(--parent-font-base)",
                  cursor: "pointer",
                  fontWeight: selectedEmotion === emotion ? 600 : 400,
                  minHeight: "var(--parent-btn-height)",
                }}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 건강 체크 */}
      <div style={{ background: "#FFFBF2", borderRadius: "26px", padding: "20px", marginBottom: "16px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 16px", fontWeight: 600 }}>
          몸 상태는 어떠세요?
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {HEALTH_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedHealth(i)}
              style={{
                background: selectedHealth === i ? "#241E1A" : "#FAF6EE",
                border: "none",
                borderRadius: "18px", padding: "8px 4px",
                minHeight: "var(--parent-btn-height)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                minWidth: "52px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{opt.emoji}</span>
              <span style={{ fontSize: "var(--parent-font-caption)", color: selectedHealth === i ? "#FBF6EC" : "#6E4A39", lineHeight: 1.2, textAlign: "center" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div style={{ background: "#FFFBF2", borderRadius: "26px", padding: "20px", marginBottom: "20px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 12px", fontWeight: 500 }}>
          더 하고 싶은 말이 있으세요? <span style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C" }}>(선택사항)</span>
        </p>
        <div style={{ position: "relative" }}>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 어떠셨나요?"
            style={{
              width: "100%", minHeight: "100px", fontSize: "var(--parent-font-base)",
              border: "1px solid #E8DECF", borderRadius: "16px", padding: "12px",
              paddingRight: speechSupported ? "52px" : "12px",
              resize: "none", outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", color: "#241E1A", lineHeight: 1.6,
              background: "#FAF6EE",
            }}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              style={{
                position: "absolute", right: "10px", bottom: "10px",
                background: listening ? "#241E1A" : "#F0E7D7",
                border: "none", borderRadius: "999px", width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: listening ? "#FBF6EC" : "#3D332C",
                fontSize: "18px"
              }}
            >
              {listening ? "🔇" : "🎙"}
            </button>
          )}
        </div>
        {listening && (
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#6E4A39", margin: "8px 0 0" }}>
            듣고 있어요...
          </p>
        )}
      </div>

      {/* 저장 버튼 */}
      {saved ? (
        <div style={{ textAlign: "center", padding: "16px", background: "#CDDCC8", borderRadius: "999px", marginBottom: "12px" }}>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, fontWeight: 600 }}>
            기록했어요! ✓
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          style={{
            width: "100%", minHeight: "var(--parent-btn-height)", marginBottom: "12px",
            background: selectedMood !== null && selectedHealth !== null ? "#241E1A" : "#D5CFC8",
            color: selectedMood !== null && selectedHealth !== null ? "#FBF6EC" : "#9A8B7D",
            border: "none", borderRadius: "999px",
            fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
          }}
        >
          오늘 기록 완료!
        </button>
      )}

      <button
        type="button"
        onClick={() => router.push("/parent/checkin/history")}
        style={{
          width: "100%", background: "transparent", border: "1px solid #E8DECF",
          borderRadius: "999px", padding: "14px", fontSize: "var(--parent-font-base)",
          color: "#8A6B5C", cursor: "pointer",
        }}
      >
        지난 기록 보기 →
      </button>
    </ParentAppShell>
  );
}
