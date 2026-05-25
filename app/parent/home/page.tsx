"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, mockInbox, mockDailyQuestions, relationshipTemperature } from "@/lib/mockData";

const MOOD_EMOJIS = ["😄", "🙂", "😐", "😔", "😢"];

function ArrowDot({ color = "#241E1A", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ParentHomePage() {
  const router = useRouter();
  const [quickMood, setQuickMood] = useState<number | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendText, setSendText] = useState("");
  const [sentDone, setSentDone] = useState(false);

  const unreadInbox = mockInbox.filter((e) => !e.read);
  const latestInbox = mockInbox[0];
  const todayQuestion = mockDailyQuestions[0];
  const childName = childProfile.name;
  const parentName = "어머니";

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    month: "long", day: "numeric", weekday: "long"
  });

  function handleSend() {
    if (!sendText.trim()) return;
    setSentDone(true);
    setTimeout(() => {
      setShowSendModal(false);
      setSendText("");
      setSentDone(false);
    }, 1500);
  }

  return (
    <ParentAppShell>
      {/* 인사 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: 0, letterSpacing: "-0.005em" }}>
          {todayStr}
        </p>
        <div style={{
          width: "46px", height: "46px", borderRadius: "999px",
          border: "1px solid #E8DECF", background: "#FFFBF2",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 500, color: "#241E1A"
        }}>
          설정
        </div>
      </div>

      <h1 style={{
        fontSize: "var(--parent-font-title, 34px)", color: "#241E1A",
        margin: "0 0 30px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em"
      }}>
        안녕하세요,<br/>{parentName}!
      </h1>

      {/* 자녀 안부 카드 — lime 블록 */}
      <button
        type="button"
        onClick={() => router.push("/parent/inbox")}
        style={{
          width: "100%", textAlign: "left",
          background: "#D8E0A6", borderRadius: "30px",
          padding: "28px 26px 30px", marginBottom: "20px",
          border: "none", cursor: "pointer"
        }}
      >
        <p style={{ fontSize: "15px", color: "#3D332C", margin: "0 0 20px", fontWeight: 500 }}>
          {unreadInbox.length > 0 ? `${childName}이가 안부를 보냈어요` : "아직 새 안부가 없어요"}
        </p>
        {unreadInbox.length > 0 && (
          <p style={{
            fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.5,
            color: "#241E1A", margin: "0 0 22px"
          }}>
            "{latestInbox.text}"
          </p>
        )}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          paddingTop: "18px", borderTop: "1px solid rgba(36,30,26,0.16)"
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "999px",
            background: "#241E1A", color: "#FBF6EC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", fontWeight: 600
          }}>
            {childName.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.015em", color: "#241E1A", margin: "0 0 2px" }}>
              {childName}이가 보냈어요
            </p>
            <p style={{ fontSize: "13px", color: "#241E1A", opacity: 0.6, margin: 0 }}>방금 전</p>
          </div>
        </div>
      </button>

      {/* 답장 + 기분 남기기 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => router.push("/parent/inbox")}
          style={{
            width: "100%", background: "#241E1A", color: "#FBF6EC",
            border: "none", borderRadius: "999px",
            padding: "22px 26px", fontSize: "18px", fontWeight: 500,
            cursor: "pointer", letterSpacing: "-0.012em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          답장 보내기
          <ArrowDot color="#FBF6EC" size={16}/>
        </button>
        <button
          type="button"
          onClick={() => router.push("/parent/checkin")}
          style={{
            width: "100%", background: "#FFFBF2", color: "#241E1A",
            border: "1px solid #E8DECF", borderRadius: "999px",
            padding: "21px 26px", fontSize: "17px", fontWeight: 500,
            cursor: "pointer", letterSpacing: "-0.012em"
          }}
        >
          오늘 기분 남기기
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "14px", color: "#8A6B5C", margin: "0 0 20px", letterSpacing: "-0.01em" }}>
        짧게 답해도 괜찮아요.
      </p>

      {/* 오늘의 질문 */}
      <div style={{ background: "#F1E5C8", borderRadius: "28px", padding: "22px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#3D332C", margin: 0, fontWeight: 500 }}>
            오늘의 질문
          </p>
          <span style={{
            width: "36px", height: "36px", borderRadius: "999px",
            background: "rgba(36,30,26,0.08)", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700,
            fontStyle: "italic", color: "#241E1A"
          }}>"</span>
        </div>
        <p style={{
          fontSize: "var(--parent-font-base, 22px)", fontWeight: 600,
          letterSpacing: "-0.025em", lineHeight: 1.4, color: "#241E1A",
          margin: "0 0 16px"
        }}>
          {todayQuestion.question}
        </p>
        <button
          type="button"
          onClick={() => router.push("/parent/question")}
          style={{
            width: "100%", background: "#241E1A", color: "#FBF6EC",
            border: "none", borderRadius: "999px",
            padding: "21px 26px", fontSize: "var(--parent-font-base, 18px)", fontWeight: 500,
            cursor: "pointer", letterSpacing: "-0.012em"
          }}
        >
          답변하러 가기
        </button>
      </div>

      {/* 기분 체크인 */}
      <div style={{ background: "#FFFBF2", borderRadius: "20px", padding: "20px", marginBottom: "16px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "var(--parent-font-base, 18px)", color: "#241E1A", margin: "0 0 16px", fontWeight: 500, letterSpacing: "-0.015em" }}>
          오늘 기분은 어떠세요?
        </p>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "12px" }}>
          {MOOD_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuickMood(i)}
              style={{
                background: quickMood === i ? "#F0E7D7" : "transparent",
                border: quickMood === i ? "2px solid #E8DECF" : "2px solid transparent",
                borderRadius: "12px", padding: "8px", fontSize: "28px",
                cursor: "pointer", transition: "all 0.15s"
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        {quickMood !== null && (
          <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C", textAlign: "center", margin: "0 0 8px" }}>
            기록했어요!
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push("/parent/checkin")}
          style={{
            background: "transparent", border: "none", color: "#8A6B5C",
            fontSize: "var(--parent-font-caption, 14px)", cursor: "pointer", width: "100%", textAlign: "center"
          }}
        >
          자세히 기록하기 →
        </button>
      </div>

      {/* 안부 보내기 버튼 */}
      <button
        type="button"
        onClick={() => setShowSendModal(true)}
        style={{
          width: "100%", background: "#241E1A", color: "#FBF6EC",
          border: "none", borderRadius: "999px",
          padding: "22px 26px", fontSize: "var(--parent-font-base, 18px)", fontWeight: 500,
          cursor: "pointer", marginBottom: "16px", letterSpacing: "-0.012em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
        }}
      >
        {childName}이에게 안부 보내기
        <ArrowDot color="#FBF6EC" size={16}/>
      </button>

      {/* 안부 보내기 모달 */}
      {showSendModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(36,30,26,0.4)", zIndex: 50,
            display: "flex", alignItems: "flex-end", justifyContent: "center"
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSendModal(false); }}
        >
          <div
            style={{
              background: "#FAF6EE", borderRadius: "24px 24px 0 0", padding: "28px 22px 40px",
              width: "100%", maxWidth: "430px"
            }}
          >
            <p style={{ fontSize: "var(--parent-font-base, 18px)", color: "#241E1A", fontWeight: 600, margin: "0 0 16px", letterSpacing: "-0.015em" }}>
              {childName}이에게 안부 보내기
            </p>
            {sentDone ? (
              <p style={{ fontSize: "var(--parent-font-base, 18px)", color: "#8A6B5C", textAlign: "center", padding: "20px 0" }}>
                전달했어요!
              </p>
            ) : (
              <>
                <textarea
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  placeholder="안부를 적어보세요"
                  style={{
                    width: "100%", minHeight: "120px", fontSize: "var(--parent-font-base, 18px)",
                    border: "1px solid #E8DECF", borderRadius: "16px", padding: "16px",
                    resize: "none", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", color: "#241E1A", background: "#FFFBF2"
                  }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  style={{
                    width: "100%", marginTop: "12px",
                    background: "#241E1A", color: "#FBF6EC",
                    border: "none", borderRadius: "999px",
                    padding: "21px 26px", fontSize: "var(--parent-font-base, 18px)",
                    fontWeight: 500, cursor: "pointer", letterSpacing: "-0.012em"
                  }}
                >
                  보내기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </ParentAppShell>
  );
}
