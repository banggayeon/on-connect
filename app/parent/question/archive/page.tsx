"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
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
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          지난 질문들
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {archives.map((q) => {
          const open = openId === q.id;
          const answered = isAnswered(q);
          const inAnswerMode = answerMode === q.id;

          return (
            <div key={q.id} style={{ background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => toggle(q.id)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 4px" }}>
                    {formatDate(q.date)}
                  </p>
                  <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
                    {q.question}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
                  <span
                    style={{
                      fontSize: "var(--parent-font-caption)",
                      background: answered ? "#E8F3E5" : "#FFEDE0",
                      color: answered ? "#2A6B2A" : "#B07A5C",
                      padding: "3px 10px", borderRadius: "99px", fontWeight: 500,
                    }}
                  >
                    {answered ? "답변 완료" : "답변 전"}
                  </span>
                  {open ? <ChevronUp size={18} color="#B07A5C" /> : <ChevronDown size={18} color="#B07A5C" />}
                </div>
              </button>

              {open && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #FFF0E6" }}>
                  {/* 내 답변 */}
                  {answered && !inAnswerMode ? (
                    <div style={{ marginTop: "12px" }}>
                      <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>
                        내 답변
                      </p>
                      <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, lineHeight: 1.6 }}>
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
                          border: "1px solid #FFCBB0", borderRadius: "12px", padding: "12px",
                          resize: "none", outline: "none", boxSizing: "border-box",
                          fontFamily: "inherit", color: "#3D2419",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmit(q)}
                        style={{
                          width: "100%", minHeight: "var(--parent-btn-height)", marginTop: "8px",
                          background: "linear-gradient(135deg, #FF8A65, #E07856)",
                          color: "white", border: "none", borderRadius: "12px",
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
                        background: "linear-gradient(135deg, #FF8A65, #E07856)",
                        color: "white", border: "none", borderRadius: "12px",
                        fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      지금 답변하기
                    </button>
                  )}

                  {/* 자녀 답변 */}
                  {q.childAnswer && (
                    <div style={{ marginTop: "12px", background: "#FFE5DA", borderRadius: "12px", padding: "14px" }}>
                      <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A3E25", margin: "0 0 4px", fontWeight: 500 }}>
                        {childProfile.name}이의 답변
                      </p>
                      <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, lineHeight: 1.6 }}>
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
