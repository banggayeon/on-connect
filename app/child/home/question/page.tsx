"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { mockDailyQuestions } from "@/lib/mockData";

const CATEGORY_LABELS: Record<string, string> = {
  memory: "추억", value: "가치관", daily: "일상", dream: "꿈", relationship: "관계",
};

const CATEGORY_TONES: Record<string, string> = {
  memory: "#F1D6CC", value: "#CDDCC8", daily: "#F6D6BD", dream: "#D9D0E5", relationship: "#D8E0A6",
};

export default function ChildQuestionPage() {
  const router = useRouter();
  const today = mockDailyQuestions[0];

  const [myAnswer, setMyAnswer] = useState(today.childAnswer ?? "");
  const [submitted, setSubmitted] = useState(!!today.childAnswer);
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
      setMyAnswer(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function handleSubmit() {
    if (!myAnswer.trim()) return;
    today.childAnswer = myAnswer;
    setSubmitted(true);
  }

  const categoryTone = CATEGORY_TONES[today.category] ?? "#F0E7D7";
  const bothAnswered = submitted && !!today.parentAnswer;

  return (
    <DetailScreen title="오늘의 질문">
      {/* ── 카테고리 + 질문 ── */}
      <div style={{ position: "relative", paddingLeft: 18, marginBottom: 32 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 4, borderRadius: 999, background: categoryTone,
        }} />
        <div style={{
          display: "inline-block", padding: "3px 10px",
          background: categoryTone, borderRadius: 999,
          fontSize: "11px", fontWeight: 600, color: "#241E1A",
          letterSpacing: "-0.005em", marginBottom: 10,
        }}>
          {CATEGORY_LABELS[today.category] ?? today.category}
        </div>
        <p style={{
          fontSize: "22px", fontWeight: 700, lineHeight: 1.4,
          letterSpacing: "-0.025em", color: "#241E1A", margin: 0,
        }}>
          {today.question}
        </p>
      </div>

      {/* ── 나의 답변 ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 12,
        }}>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.015em" }}>
            나의 답변
          </span>
          {submitted && (
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "12px", color: "#8A6B5C", padding: 0,
              }}
            >
              수정하기
            </button>
          )}
        </div>

        {submitted ? (
          <div style={{
            position: "relative", paddingLeft: 18,
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 4, borderRadius: 999, background: "#CDDCC8",
            }} />
            <p style={{
              fontSize: "16px", color: "#241E1A", margin: 0,
              lineHeight: 1.65, letterSpacing: "-0.015em",
            }}>
              {myAnswer}
            </p>
          </div>
        ) : (
          <>
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={myAnswer}
                onChange={(e) => {
                  setMyAnswer(e.target.value);
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                }}
                placeholder="오늘 질문에 대한 생각을 자유롭게 적어보세요"
                style={{
                  width: "100%", minHeight: "120px",
                  fontSize: "15px", lineHeight: 1.65,
                  border: "1.5px solid #E8DECF", borderRadius: 16,
                  padding: "14px",
                  paddingRight: speechSupported ? "52px" : "14px",
                  resize: "none", outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit",
                  color: "#241E1A", background: "#FFFBF2",
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!myAnswer.trim()}
              style={{
                width: "100%", marginTop: 12, padding: "16px",
                background: myAnswer.trim() ? "#241E1A" : "#E8DECF",
                color: myAnswer.trim() ? "#FBF6EC" : "#A89B8C",
                border: "none", borderRadius: 999,
                fontSize: "15px", fontWeight: 700,
                cursor: myAnswer.trim() ? "pointer" : "default",
                letterSpacing: "-0.01em",
              }}
            >
              답변 제출하기
            </button>
          </>
        )}
      </div>

      {/* ── 부모님 답변 ── */}
      <div style={{ borderTop: "1px solid #F0E7D7", paddingTop: 24, marginBottom: 28 }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.015em" }}>
          부모님 답변
        </span>

        {submitted ? (
          bothAnswered ? (
            <div style={{ position: "relative", paddingLeft: 18, marginTop: 14 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 4, borderRadius: 999, background: "#F6D6BD",
              }} />
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 6px", fontWeight: 600 }}>
                어머니의 답변
              </p>
              <p style={{
                fontSize: "16px", color: "#241E1A", margin: 0,
                lineHeight: 1.65, letterSpacing: "-0.015em",
              }}>
                {today.parentAnswer}
              </p>
            </div>
          ) : (
            <p style={{
              fontSize: "13px", color: "#8A6B5C", margin: "14px 0 0",
              lineHeight: 1.6, letterSpacing: "-0.005em",
            }}>
              아직 부모님이 답변하지 않으셨어요 🌿<br/>
              양쪽 답변이 모이면 서로의 답이 공개돼요.
            </p>
          )
        ) : (
          <p style={{
            fontSize: "13px", color: "#8A6B5C", margin: "14px 0 0",
            lineHeight: 1.6, letterSpacing: "-0.005em",
          }}>
            내 답변을 먼저 제출하면 볼 수 있어요.
          </p>
        )}
      </div>

      {/* ── 지난 질문 ── */}
      <button
        type="button"
        onClick={() => router.push("/child/home/question/archive")}
        style={{
          width: "100%", background: "transparent",
          border: "1.5px solid #E8DECF", borderRadius: 999,
          padding: "16px 20px",
          fontSize: "14px", fontWeight: 500,
          color: "#8A6B5C", cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        지난 질문 보기 →
      </button>
    </DetailScreen>
  );
}
