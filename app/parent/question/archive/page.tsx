"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, mockDailyQuestions } from "@/lib/mockData";
import type { DailyQuestion } from "@/lib/mockData";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function QuestionArchivePage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [answerMode, setAnswerMode] = useState<string | null>(null);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  const archives = mockDailyQuestions.slice(1);

  function toggle(id: string) {
    setOpenId(openId === id ? null : id);
  }

  function handleSubmit(q: DailyQuestion) {
    const text = draftAnswers[q.id] ?? "";
    if (!text.trim()) return;
    q.parentAnswer = text;
    setSubmittedIds((prev) => new Set([...prev, q.id]));
    setAnswerMode(null);
  }

  function isAnswered(q: DailyQuestion) {
    return !!q.parentAnswer || submittedIds.has(q.id);
  }

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#241E1A", margin: 0, fontWeight: 600 }}>
          지난 질문들
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {archives.map((q) => {
          const open = openId === q.id;
          const answered = isAnswered(q);
          const inAnswerMode = answerMode === q.id;

          return (
            <div key={q.id} style={{ background: "#FFFBF2", borderRadius: "26px", border: "1px solid #E8DECF", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => toggle(q.id)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: "0 0 4px" }}>
                    {formatDate(q.date)}
                  </p>
                  <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
                    {q.question}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
                  <span
                    style={{
                      fontSize: "var(--parent-font-caption)",
                      background: answered ? "#CDDCC8" : "#F0E7D7",
                      color: answered ? "#3D332C" : "#8A6B5C",
                      padding: "3px 10px", borderRadius: "999px", fontWeight: 500,
                    }}
                  >
                    {answered ? "답변 완료" : "답변 전"}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {open
                      ? <path d="M18 15L12 9L6 15" />
                      : <path d="M6 9L12 15L18 9" />
                    }
                  </svg>
                </div>
              </button>

              {open && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F0E7D7" }}>
                  {/* 내 답변 */}
                  {answered && !inAnswerMode ? (
                    <div style={{ marginTop: "12px" }}>
                      <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>
                        내 답변
                      </p>
                      <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, lineHeight: 1.6 }}>
                        {q.parentAnswer ?? draftAnswers[q.id]}
                      </p>
                    </div>
                  ) : inAnswerMode ? (
                    <div style={{ marginTop: "12px" }}>
                      <textarea
                        value={draftAnswers[q.id] ?? ""}
                        onChange={(e) => setDraftAnswers({ ...draftAnswers, [q.id]: e.target.value })}
                        placeholder="답변을 적어보세요"
                        style={{
                          width: "100%", minHeight: "100px", fontSize: "var(--parent-font-base)",
                          border: "1px solid #E8DECF", borderRadius: "18px", padding: "12px",
                          resize: "none", outline: "none", boxSizing: "border-box",
                          fontFamily: "inherit", color: "#241E1A", background: "#FAF6EE",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmit(q)}
                        style={{
                          width: "100%", minHeight: "var(--parent-btn-height)", marginTop: "8px",
                          background: "#241E1A",
                          color: "#FBF6EC", border: "none", borderRadius: "999px",
                          fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        답변 보내기
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAnswerMode(q.id)}
                      style={{
                        width: "100%", minHeight: "var(--parent-btn-height)", marginTop: "12px",
                        background: "#241E1A",
                        color: "#FBF6EC", border: "none", borderRadius: "999px",
                        fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      지금 답변하기
                    </button>
                  )}

                  {/* 자녀 답변 */}
                  {q.childAnswer && (
                    <div style={{ marginTop: "12px", background: "#F1D6CC", borderRadius: "18px", padding: "14px" }}>
                      <p style={{ fontSize: "var(--parent-font-caption)", color: "#6E4A39", margin: "0 0 4px", fontWeight: 500 }}>
                        {childProfile.name}이의 답변
                      </p>
                      <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, lineHeight: 1.6 }}>
                        {q.childAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ParentAppShell>
  );
}
