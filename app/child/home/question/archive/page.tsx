"use client";

import { DetailScreen } from "@/components/child/DetailScreen";
import { mockDailyQuestions } from "@/lib/mockData";

const CATEGORY_COLOR: Record<string, string> = {
  memory: "#F1D6CC",
  value: "#CDDCC8",
  daily: "#F6D6BD",
  dream: "#D9D0E5",
  relationship: "#D8E0A6"
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
    <DetailScreen title="지난 질문 아카이브">
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
        두 분이 함께 답한 질문들이에요. 대화 소재로 활용해보세요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mockDailyQuestions.map((q) => {
          const tone = CATEGORY_COLOR[q.category] ?? "#F0E7D7";
          const bothAnswered = !!q.childAnswer && !!q.parentAnswer;
          const [, mm, dd] = q.date.split("-");
          return (
            <div
              key={q.id}
              style={{
                background: "#FFFBF2",
                borderRadius: "22px",
                padding: "18px",
                border: "1px solid #E8DECF"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    background: tone,
                    color: "#3D332C",
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontWeight: 500
                  }}
                >
                  {CATEGORY_LABELS[q.category]}
                </span>
                <span style={{ fontSize: "11px", color: "#8A6B5C" }}>{parseInt(mm)}월 {parseInt(dd)}일</span>
              </div>

              <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
                {q.question}
              </p>

              {bothAnswered ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ background: "#FAF6EE", borderRadius: "14px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>나의 답변</p>
                    <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>{q.childAnswer}</p>
                  </div>
                  <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#6E4A39", margin: "0 0 4px", fontWeight: 500 }}>어머니 답변</p>
                    <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>{q.parentAnswer}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {q.childAnswer && (
                    <span style={{ fontSize: "11px", color: "#3D332C", background: "#CDDCC8", borderRadius: "999px", padding: "3px 10px" }}>
                      내 답변 있음
                    </span>
                  )}
                  {!q.childAnswer && (
                    <span style={{ fontSize: "11px", color: "#8A6B5C", background: "#F0E7D7", borderRadius: "999px", padding: "3px 10px" }}>
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
