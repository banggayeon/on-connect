"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, mockDailyQuestions } from "@/lib/mockData";

export default function ParentQuestionPage() {
  const router = useRouter();
  const todayQ = mockDailyQuestions[0];

  const [answerText, setAnswerText] = useState(todayQ.parentAnswer ?? "");
  const [submitted, setSubmitted] = useState(!!todayQ.parentAnswer);
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
      setAnswerText(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function handleSubmit() {
    if (!answerText.trim()) return;
    setSubmitted(true);
    todayQ.parentAnswer = answerText;
  }

  const bothAnswered = submitted && !!todayQ.childAnswer;

  return (
    <ParentAppShell>
      <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: "0 0 24px", fontWeight: 600 }}>
        오늘의 질문
      </h1>

      {/* 질문 카드 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF8F0, #FFEDE0)",
          borderRadius: "20px", padding: "28px 24px", marginBottom: "24px",
          border: "1px solid #FFD9B8", textAlign: "center",
        }}
      >
        <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>
          오늘의 질문
        </p>
        <p style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
          {todayQ.question}
        </p>
      </div>

      {/* 내 답변 영역 */}
      {submitted ? (
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>
            내 답변
          </p>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, lineHeight: 1.6 }}>
            {answerText}
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="생각나는 대로 편하게 적어보세요"
              style={{
                width: "100%", minHeight: "140px", fontSize: "var(--parent-font-base)",
                border: "1px solid #FFCBB0", borderRadius: "16px", padding: "16px",
                paddingRight: speechSupported ? "52px" : "16px",
                resize: "none", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", color: "#3D2419", lineHeight: 1.6,
              }}
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                style={{
                  position: "absolute", right: "12px", bottom: "12px",
                  background: listening ? "#FF8A65" : "#FFEDE0",
                  border: "none", borderRadius: "50%", width: "44px", height: "44px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: listening ? "white" : "#E07856",
                }}
              >
                {listening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
          </div>
          {listening && (
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#FF8A65", textAlign: "center", margin: "-4px 0 12px" }}>
              듣고 있어요...
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: "100%", minHeight: "var(--parent-btn-height)",
              background: "linear-gradient(135deg, #FF8A65, #E07856)",
              color: "white", border: "none", borderRadius: "16px",
              fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
            }}
          >
            답변 보내기
          </button>
        </div>
      )}

      {/* 자녀 답변 영역 */}
      {submitted && (
        <div style={{ marginBottom: "16px" }}>
          {bothAnswered ? (
            <div style={{ background: "#FFE5DA", borderRadius: "20px", padding: "20px" }}>
              <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A3E25", margin: "0 0 8px", fontWeight: 500 }}>
                {childProfile.name}이의 답변
              </p>
              <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, lineHeight: 1.6 }}>
                {todayQ.childAnswer}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", textAlign: "center" }}>
              {childProfile.name}이도 곧 답변할 거예요 🌿
            </p>
          )}
        </div>
      )}

      {/* 지난 질문 보기 링크 */}
      <button
        type="button"
        onClick={() => router.push("/parent/question/archive")}
        style={{
          width: "100%", background: "transparent", border: "1px solid #FFE4CC",
          borderRadius: "16px", padding: "14px", fontSize: "var(--parent-font-base)",
          color: "#B07A5C", cursor: "pointer", marginTop: "8px",
        }}
      >
        지난 질문 보기 →
      </button>
    </ParentAppShell>
  );
}
