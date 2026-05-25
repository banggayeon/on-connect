"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ImagePlus, Send, Sparkles } from "lucide-react";
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
    <DetailScreen title="오늘의 질문" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 질문 카드 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF8A65, #E07856)",
          borderRadius: "24px",
          padding: "28px 24px",
          marginBottom: "16px",
          boxShadow: "0 12px 28px rgba(224,120,86,0.3)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.88)",
              background: "rgba(255,255,255,0.22)",
              borderRadius: "999px",
              padding: "3px 10px",
              fontWeight: 500
            }}
          >
            {CATEGORY_LABELS[today.category] ?? today.category}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>
            <Sparkles size={12} /> AI 질문
          </span>
        </div>
        <p style={{ fontSize: "20px", color: "white", margin: 0, fontWeight: 500, lineHeight: 1.45 }}>
          {today.question}
        </p>
      </div>

      {/* 나의 답변 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>나의 답변</p>
        {submitted ? (
          <div>
            <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 10px", lineHeight: 1.55 }}>
              {myAnswer || "(답변 없음)"}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                fontSize: "12px",
                color: "#B07A5C",
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
                border: "1.5px solid #F0E4D8",
                borderRadius: "12px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#3D2419",
                background: "#FBF6F0",
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
                  background: "#FBF6F0",
                  border: "1px solid #F0E4D8",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  fontSize: "13px",
                  color: "#8A6B5C",
                  cursor: "pointer"
                }}
              >
                <ImagePlus size={15} /> 사진 첨부
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
                  background: myAnswer.trim()
                    ? "linear-gradient(135deg, #FF8A65, #E07856)"
                    : "#F0E4D8",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  fontSize: "13px",
                  color: myAnswer.trim() ? "white" : "#B07A5C",
                  cursor: myAnswer.trim() ? "pointer" : "default",
                  fontWeight: 600
                }}
              >
                <Send size={14} /> 제출
              </button>
            </div>
          </>
        )}
      </div>

      {/* 부모님 답변 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>어머니의 답변</p>
        {today.parentAnswer ? (
          <div
            style={{
              background: "#FFF1DA",
              borderRadius: "14px",
              padding: "14px 16px"
            }}
          >
            <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.55 }}>
              {today.parentAnswer}
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#FBF6F0",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "14px", color: "#B07A5C", margin: "0 0 4px" }}>아직 어머니가 답하지 않으셨어요</p>
            <p style={{ fontSize: "12px", color: "#C5A898", margin: 0 }}>양쪽 답변이 모이면 서로의 답이 공개돼요</p>
          </div>
        )}
      </div>

      {/* 지난 질문 보기 */}
      <button
        type="button"
        onClick={() => router.push("/child/home/question/archive")}
        style={{
          width: "100%",
          background: "white",
          border: "1.5px solid #F0E4D8",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span style={{ fontSize: "14px", color: "#3D2419", fontWeight: 500 }}>지난 질문 아카이브 보기</span>
        <ChevronRight size={16} style={{ color: "#B07A5C" }} />
      </button>
    </DetailScreen>
  );
}
