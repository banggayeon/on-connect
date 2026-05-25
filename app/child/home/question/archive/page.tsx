"use client";

import { DetailScreen } from "@/components/child/DetailScreen";
import { mockDailyQuestions } from "@/lib/mockData";

const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  memory: { bg: "#FFE5DA", text: "#8A3E25" },
  value: { bg: "#E8F3E5", text: "#3A6B3A" },
  daily: { bg: "#FFF1DA", text: "#7A5A1A" },
  dream: { bg: "#E0EDF5", text: "#2C5A7A" },
  relationship: { bg: "#F0E8F5", text: "#6A3A7A" }
};

const CATEGORY_LABELS: Record<string, string> = {
  memory: "추억",
  value: "가치관",
  daily: "일상",
  dream: "꿈",
  relationship: "관계"
};

export default function QuestionArchivePage() {
  return (
    <DetailScreen title="지난 질문 아카이브" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
        두 분이 함께 답한 질문들이에요. 대화 소재로 활용해보세요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mockDailyQuestions.map((q) => {
          const c = CATEGORY_COLOR[q.category] ?? CATEGORY_COLOR.daily;
          const bothAnswered = !!q.childAnswer && !!q.parentAnswer;
          const [, mm, dd] = q.date.split("-");
          return (
            <div
              key={q.id}
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "18px",
                boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    background: c.bg,
                    color: c.text,
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontWeight: 500
                  }}
                >
                  {CATEGORY_LABELS[q.category]}
                </span>
                <span style={{ fontSize: "11px", color: "#C5A898" }}>{parseInt(mm)}월 {parseInt(dd)}일</span>
              </div>

              <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
                {q.question}
              </p>

              {bothAnswered ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ background: "#FBF6F0", borderRadius: "12px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>나의 답변</p>
                    <p style={{ fontSize: "13px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>{q.childAnswer}</p>
                  </div>
                  <div style={{ background: "#FFF1DA", borderRadius: "12px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#8A3E25", margin: "0 0 4px", fontWeight: 500 }}>어머니 답변</p>
                    <p style={{ fontSize: "13px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>{q.parentAnswer}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {q.childAnswer && (
                    <span style={{ fontSize: "11px", color: "#7AB87A", background: "#E8F3E5", borderRadius: "999px", padding: "3px 10px" }}>
                      내 답변 있음
                    </span>
                  )}
                  {!q.childAnswer && (
                    <span style={{ fontSize: "11px", color: "#B07A5C", background: "#FBF6F0", borderRadius: "999px", padding: "3px 10px" }}>
                      미답변
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DetailScreen>
  );
}
