"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import type { EmotionContextAnalysisResult, WarmReplyOption } from "@/lib/types";

const TONE_LABELS: Record<string, string> = {
  warm: "따뜻하게",
  casual: "편하게",
  formal: "정중하게",
};

export default function ParentReplyPage() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [replies, setReplies] = useState<WarmReplyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    if (!draft.trim()) return;
    setLoading(true);
    setReplies([]);
    setSelected(null);
    setCopied(false);
    try {
      const res = await fetch("/api/ai/warm-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawMessage: draft }),
      });
      const data = (await res.json()) as EmotionContextAnalysisResult;
      setReplies(data.suggestedReplies ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  function handleSelect(text: string) {
    setSelected(text);
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const canSubmit = draft.trim().length > 0 && !loading;

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title, 28px)", color: "#241E1A", margin: 0, fontWeight: 700, letterSpacing: "-0.025em" }}>
          말 다듬기
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: "0 0 22px", lineHeight: 1.6 }}>
        하고 싶은 말을 적으면, 자녀에게 더 부드럽게 전달할 수 있도록 다듬어드려요.
      </p>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="예: 밥은 먹었어? 요즘 왜 연락이 없니"
        style={{
          width: "100%", minHeight: "130px",
          fontSize: "var(--parent-font-base, 20px)",
          border: "1.5px solid #E8DECF", borderRadius: 20,
          padding: "18px", resize: "none", outline: "none",
          boxSizing: "border-box", fontFamily: "inherit",
          color: "#241E1A", background: "#FFFBF2", lineHeight: 1.6,
          marginBottom: 14,
        }}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: "100%",
          background: canSubmit ? "#241E1A" : "#E8DECF",
          color: canSubmit ? "#FBF6EC" : "#8A6B5C",
          border: "none", borderRadius: 999,
          padding: "var(--parent-btn-height, 22px) 26px",
          fontSize: "var(--parent-font-base, 20px)", fontWeight: 600,
          cursor: canSubmit ? "pointer" : "default",
          letterSpacing: "-0.012em", marginBottom: 28,
          transition: "background 0.2s",
        }}
      >
        {loading ? "다듬는 중…" : "다듬어주세요"}
      </button>

      {replies.length > 0 && (
        <>
          <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: "0 0 14px" }}>
            아래 문장 중 마음에 드는 것을 눌러 복사하세요.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {replies.slice(0, 3).map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(reply.text)}
                style={{
                  background: selected === reply.text ? "#F1E5C8" : "#FFFBF2",
                  border: selected === reply.text ? "2px solid #6E4A39" : "1.5px solid #E8DECF",
                  borderRadius: 20, padding: "18px 20px",
                  fontSize: "var(--parent-font-base, 20px)", color: "#241E1A",
                  cursor: "pointer", textAlign: "left", fontWeight: 500, lineHeight: 1.5,
                  width: "100%", display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <span>{reply.text}</span>
                <span style={{
                  fontSize: "var(--parent-font-caption, 14px)", color: "#8A6B5C",
                  background: "#F0E7D7", borderRadius: 999, padding: "3px 10px",
                  alignSelf: "flex-start",
                }}>
                  {TONE_LABELS[reply.tone] ?? reply.tone} · 눌러서 복사
                </span>
              </button>
            ))}
          </div>
          {copied && (
            <div style={{
              marginTop: 16, background: "#CDDCC8", borderRadius: 16, padding: "16px 18px",
              fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", textAlign: "center",
            }}>
              복사됐어요! 카카오톡에 붙여넣기 하세요.
            </div>
          )}
        </>
      )}

      <p style={{ fontSize: "13px", color: "#8A6B5C", textAlign: "center", margin: "32px 0 0", lineHeight: 1.6 }}>
        자녀가 직접 공유하지 않은 정보는 사용하지 않아요
      </p>
    </ParentAppShell>
  );
}
