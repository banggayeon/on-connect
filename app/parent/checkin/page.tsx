"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, MicOff } from "lucide-react";
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
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          오늘의 기록
        </h1>
      </div>

      {/* 공유 상태 안내 */}
      <div
        style={{
          background: isShared ? "#E8F3E5" : "#F5F5F5",
          borderRadius: "12px", padding: "10px 16px", marginBottom: "24px",
        }}
      >
        <p style={{ fontSize: "var(--parent-font-caption)", color: isShared ? "#2A6B2A" : "#6B6B6B", margin: 0 }}>
          {isShared ? `📢 이 기록은 ${childProfile.name}이와 공유돼요` : "🔒 이 기록은 나만 볼 수 있어요"}
        </p>
      </div>

      {/* 기분 체크 */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 16px", fontWeight: 600 }}>
          오늘 기분이 어떠세요?
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {MOOD_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMoodSelect(i)}
              style={{
                background: selectedMood === i ? "#FFEDE0" : "transparent",
                border: selectedMood === i ? "2px solid #FF8A65" : "2px solid transparent",
                borderRadius: "12px", padding: "8px 4px",
                minHeight: "var(--parent-btn-height)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                minWidth: "52px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{opt.emoji}</span>
              <span style={{ fontSize: "var(--parent-font-caption)", color: "#6B4C3B", lineHeight: 1.2, textAlign: "center" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 감정 세분화 (기분 선택 후 슬라이드인) */}
      {selectedMood !== null && (
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
            boxShadow: "0 2px 12px rgba(61,36,25,0.06)",
            animation: "slideIn 0.25s ease-out"
          }}
        >
          <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 6px", fontWeight: 600 }}>
            조금 더 구체적으로 말해보면?
          </p>
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 14px" }}>
            선택 안 해도 괜찮아요
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(MOOD_TO_EMOTIONS[selectedMood] ?? []).map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
                style={{
                  background: selectedEmotion === emotion ? "#FF8A65" : "#FFF5EE",
                  color: selectedEmotion === emotion ? "white" : "#6B4C3B",
                  border: selectedEmotion === emotion ? "2px solid #FF8A65" : "2px solid transparent",
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
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 16px", fontWeight: 600 }}>
          몸 상태는 어떠세요?
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {HEALTH_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedHealth(i)}
              style={{
                background: selectedHealth === i ? "#FFEDE0" : "transparent",
                border: selectedHealth === i ? "2px solid #FF8A65" : "2px solid transparent",
                borderRadius: "12px", padding: "8px 4px",
                minHeight: "var(--parent-btn-height)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                minWidth: "52px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{opt.emoji}</span>
              <span style={{ fontSize: "var(--parent-font-caption)", color: "#6B4C3B", lineHeight: 1.2, textAlign: "center" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 12px", fontWeight: 500 }}>
          더 하고 싶은 말이 있으세요? <span style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C" }}>(선택사항)</span>
        </p>
        <div style={{ position: "relative" }}>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 어떠셨나요?"
            style={{
              width: "100%", minHeight: "100px", fontSize: "var(--parent-font-base)",
              border: "1px solid #FFCBB0", borderRadius: "12px", padding: "12px",
              paddingRight: speechSupported ? "52px" : "12px",
              resize: "none", outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", color: "#3D2419", lineHeight: 1.6,
            }}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              style={{
                position: "absolute", right: "10px", bottom: "10px",
                background: listening ? "#FF8A65" : "#FFEDE0",
                border: "none", borderRadius: "50%", width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: listening ? "white" : "#E07856",
              }}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
        </div>
        {listening && (
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#FF8A65", margin: "8px 0 0" }}>
            듣고 있어요...
          </p>
        )}
      </div>

      {/* 저장 버튼 */}
      {saved ? (
        <div style={{ textAlign: "center", padding: "16px", background: "#E8F3E5", borderRadius: "16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#2A6B2A", margin: 0, fontWeight: 600 }}>
            기록했어요! ✓
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          style={{
            width: "100%", minHeight: "var(--parent-btn-height)", marginBottom: "12px",
            background: selectedMood !== null && selectedHealth !== null
              ? "linear-gradient(135deg, #FF8A65, #E07856)"
              : "#E0D0C8",
            color: "white", border: "none", borderRadius: "16px",
            fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
          }}
        >
          오늘 기록 완료!
        </button>
      )}

      {/* 지난 기록 보기 */}
      <button
        type="button"
        onClick={() => router.push("/parent/checkin/history")}
        style={{
          width: "100%", background: "transparent", border: "1px solid #FFE4CC",
          borderRadius: "16px", padding: "14px", fontSize: "var(--parent-font-base)",
          color: "#B07A5C", cursor: "pointer",
        }}
      >
        지난 기록 보기 →
      </button>
    </ParentAppShell>
  );
}
