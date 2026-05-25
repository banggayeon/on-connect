"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { mockDailyQuestions } from "@/lib/mockData";

const CATEGORY_LABELS: Record<string, string> = {
  memory: "추억",
  value: "가치관",
  daily: "일상",
  dream: "꿈",
  relationship: "관계"
};

export default function QuestionPage() {
  const router = useRouter();
  const today = mockDailyQuestions[0];
  const [myAnswer, setMyAnswer] = useState(today.childAnswer ?? "");
  const [submitted, setSubmitted] = useState(!!today.childAnswer);

  return (
    <DetailScreen title="오늘의 질문">
      {/* 질문 카드 */}
      <div
        style={{
          background: "#F1E5C8",
          borderRadius: "26px",
          padding: "28px 24px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "#6E4A39",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "999px",
              padding: "3px 10px",
              fontWeight: 500
            }}
          >
            {CATEGORY_LABELS[today.category] ?? today.category}
          </span>
          <span style={{ fontSize: "11px", color: "#6E4A39", fontWeight: 500 }}>
            ✦ AI 질문
          </span>
        </div>
        <p style={{ fontSize: "20px", color: "#241E1A", margin: 0, fontWeight: 700, lineHeight: 1.4, letterSpacing: "-0.02em" }}>
          {today.question}
        </p>
      </div>

      {/* 나의 답변 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>나의 답변</p>
        {submitted ? (
          <div>
            <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 10px", lineHeight: 1.55 }}>
              {myAnswer || "(답변 없음)"}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                fontSize: "12px",
                color: "#8A6B5C",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline"
              }}
            >
              수정하기
            </button>
          </div>
        ) : (
          <>
            <textarea
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="오늘 질문에 대한 나의 생각을 적어보세요..."
              style={{
                width: "100%",
                minHeight: "100px",
                border: "1px solid #E8DECF",
                borderRadius: "16px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#241E1A",
                background: "#FAF6EE",
                resize: "none",
                outline: "none",
                lineHeight: 1.5,
                fontFamily: "inherit",
                boxSizing: "border-box"
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#F0E7D7",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 14px",
                  fontSize: "13px",
                  color: "#3D332C",
                  cursor: "pointer"
                }}
              >
                📷 사진 첨부
              </button>
              <button
                type="button"
                onClick={() => { if (myAnswer.trim()) setSubmitted(true); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flex: 1,
                  justifyContent: "center",
                  background: myAnswer.trim() ? "#241E1A" : "#D5CFC8",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 14px",
                  fontSize: "13px",
                  color: myAnswer.trim() ? "#FBF6EC" : "#9A8B7D",
                  cursor: myAnswer.trim() ? "pointer" : "default",
                  fontWeight: 600
                }}
              >
                ↑ 제출
              </button>
            </div>
          </>
        )}
      </div>

      {/* 부모님 답변 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>어머니의 답변</p>
        {today.parentAnswer ? (
          <div
            style={{
              background: "#F6D6BD",
              borderRadius: "18px",
              padding: "14px 16px"
            }}
          >
            <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.55 }}>
              {today.parentAnswer}
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#FAF6EE",
              borderRadius: "18px",
              padding: "16px",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 4px" }}>아직 어머니가 답하지 않으셨어요</p>
            <p style={{ fontSize: "12px", color: "#9A8B7D", margin: 0 }}>양쪽 답변이 모이면 서로의 답이 공개돼요</p>
          </div>
        )}
      </div>

      {/* 지난 질문 보기 */}
      <button
        type="button"
        onClick={() => router.push("/child/home/question/archive")}
        style={{
          width: "100%",
          background: "#FFFBF2",
          border: "1px solid #E8DECF",
          borderRadius: "999px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span style={{ fontSize: "14px", color: "#241E1A", fontWeight: 500 }}>지난 질문 아카이브 보기</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </DetailScreen>
  );
}
