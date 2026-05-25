"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      {/* ── 헤더 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <h1 style={{
          fontSize: "var(--parent-font-title, 34px)", fontWeight: 700,
          letterSpacing: "-0.03em", color: "#241E1A", margin: 0,
        }}>
          오늘의 질문
        </h1>
      </div>
      <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", margin: "0 0 32px", letterSpacing: "-0.005em" }}>
        떠오르는 대로 편하게 적어보세요
      </p>

      {/* ── 질문 ── */}
      <div style={{
        position: "relative", paddingLeft: 18, marginBottom: 32,
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 4, borderRadius: 999, background: "#F1E5C8",
        }} />
        <p style={{
          fontSize: "var(--parent-font-title, 28px)", fontWeight: 700,
          lineHeight: 1.4, letterSpacing: "-0.03em", color: "#241E1A",
          margin: 0,
        }}>
          {todayQ.question}
        </p>
      </div>

      {/* ── 답변 영역 ── */}
      {submitted ? (
        <>
          {/* 내 답변 */}
          <div style={{
            position: "relative", paddingLeft: 18, marginBottom: 24,
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 4, borderRadius: 999, background: "#F6D6BD",
            }} />
            <p style={{
              fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C",
              fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.005em",
            }}>
              내 답변
            </p>
            <p style={{
              fontSize: "var(--parent-font-base, 20px)", color: "#241E1A",
              margin: 0, lineHeight: 1.65, letterSpacing: "-0.015em",
            }}>
              {answerText}
            </p>
          </div>

          {/* 자녀 답변 */}
          {bothAnswered ? (
            <div style={{
              position: "relative", paddingLeft: 18, marginBottom: 32,
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 4, borderRadius: 999, background: "#CDDCC8",
              }} />
              <p style={{
                fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C",
                fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.005em",
              }}>
                {childProfile.name}이의 답변
              </p>
              <p style={{
                fontSize: "var(--parent-font-base, 20px)", color: "#241E1A",
                margin: 0, lineHeight: 1.65, letterSpacing: "-0.015em",
              }}>
                {todayQ.childAnswer}
              </p>
            </div>
          ) : (
            <p style={{
              fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C",
              textAlign: "center", margin: "0 0 32px", lineHeight: 1.6,
            }}>
              {childProfile.name}이도 곧 답변할 거예요 🌿
            </p>
          )}
        </>
      ) : (
        <div style={{ marginBottom: 24 }}>
          {/* 텍스트 입력 + 음성 버튼 */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <textarea
              ref={textareaRef}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="생각나는 대로 편하게 적어보세요"
              style={{
                width: "100%", minHeight: "160px",
                fontSize: "var(--parent-font-base, 20px)",
                border: "1.5px solid #E8DECF", borderRadius: 20,
                padding: "20px",
                paddingRight: speechSupported ? "68px" : "20px",
                resize: "none", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", color: "#241E1A", lineHeight: 1.65,
                background: "#FFFBF2",
              }}
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={listening ? "음성 입력 중지" : "음성으로 입력"}
                style={{
                  position: "absolute", right: 14, bottom: 14,
                  width: 52, height: 52, borderRadius: 999,
                  background: listening ? "#241E1A" : "#F1E5C8",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: listening ? "#FBF6EC" : "#3D332C",
                  fontSize: "24px",
                }}
              >
                {listening ? "🔇" : "🎙"}
              </button>
            )}
          </div>

          {listening && (
            <p style={{
              fontSize: "var(--parent-font-caption, 15px)", color: "#6E4A39",
              textAlign: "center", margin: "0 0 14px", fontWeight: 500,
            }}>
              듣고 있어요…
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: "100%",
              minHeight: "var(--parent-btn-height, 64px)",
              background: "#241E1A", color: "#FBF6EC",
              border: "none", borderRadius: 999,
              fontSize: "var(--parent-font-base, 18px)", fontWeight: 700,
              cursor: "pointer", letterSpacing: "-0.012em",
            }}
          >
            답변 보내기
          </button>
        </div>
      )}

      {/* ── 지난 질문 보기 ── */}
      <div style={{ borderTop: "1px solid #F0E7D7", paddingTop: 20 }}>
        <button
          type="button"
          onClick={() => router.push("/parent/question/archive")}
          style={{
            width: "100%", background: "transparent",
            border: "1.5px solid #E8DECF", borderRadius: 999,
            padding: "18px 26px",
            fontSize: "var(--parent-font-base, 18px)", fontWeight: 500,
            color: "#8A6B5C", cursor: "pointer", letterSpacing: "-0.01em",
          }}
        >
          지난 질문 보기 →
        </button>
      </div>
    </ParentAppShell>
  );
}
