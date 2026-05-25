"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { mockInbox } from "@/lib/mockData";
import type { InboxEntry } from "@/lib/mockData";

type Reaction = "thanks" | "miss" | "proud";

const REACTIONS: { key: Reaction; label: string }[] = [
  { key: "thanks", label: "고마워 💛" },
  { key: "miss",   label: "보고싶다 🤗" },
  { key: "proud",  label: "잘했네 👏" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

export default function InboxDetailPage({ params }: { params: Promise<{ entryId: string }> }) {
  const { entryId } = use(params);
  const router = useRouter();

  const [entry, setEntry] = useState<InboxEntry | null>(null);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  useEffect(() => {
    const found = mockInbox.find((e) => e.id === entryId) ?? null;
    setEntry(found);
    if (found?.reaction) setReaction(found.reaction);
    if (found?.reply) setReplyText(found.reply);
  }, [entryId]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  function handleSendReply() {
    if (!replyText.trim()) return;
    setReplySent(true);
  }

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
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setReplyText(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  if (!entry) {
    return (
      <ParentAppShell>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#8A6B5C", textAlign: "center", paddingTop: "60px" }}>
          안부를 찾을 수 없어요.
        </p>
      </ParentAppShell>
    );
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
          {entry.senderName}이의 안부
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: "0 0 12px" }}>
        {formatDate(entry.date)}
      </p>

      {/* 사진 (있으면) */}
      {entry.imageUrl && (
        <div style={{ borderRadius: "22px", overflow: "hidden", marginBottom: "16px" }}>
          <img src={entry.imageUrl} alt="안부 사진" style={{ width: "100%", display: "block" }} />
        </div>
      )}

      {/* 안부 텍스트 */}
      <div style={{ background: "#FFFBF2", borderRadius: "26px", padding: "20px", marginBottom: "20px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, lineHeight: 1.7 }}>
          {entry.text}
        </p>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #F0E7D7", marginBottom: "20px" }} />

      {replySent ? (
        <div style={{ background: "#CDDCC8", borderRadius: "26px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: 0, fontWeight: 600 }}>
            답장을 전달했어요! 💛
          </p>
        </div>
      ) : (
        <>
          {/* 리액션 칩 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {REACTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setReaction(reaction === key ? null : key)}
                style={{
                  background: reaction === key ? "#F1E5C8" : "#F0E7D7",
                  border: reaction === key ? "2px solid #6E4A39" : "2px solid transparent",
                  borderRadius: "999px",
                  padding: reaction === key ? "6px 13px" : "7px 14px",
                  fontSize: "var(--parent-font-caption)",
                  color: "#241E1A",
                  fontWeight: reaction === key ? 600 : 400,
                  cursor: "pointer",
                  transition: "background 0.12s, border-color 0.12s"
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 답장 텍스트 영역 */}
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답장을 적어보세요"
              style={{
                width: "100%", minHeight: "120px", fontSize: "var(--parent-font-base)",
                border: "1px solid #E8DECF", borderRadius: "22px", padding: "16px",
                paddingRight: speechSupported ? "52px" : "16px",
                resize: "none", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", color: "#241E1A", lineHeight: 1.6,
                background: "#FFFBF2",
              }}
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                style={{
                  position: "absolute", right: "12px", bottom: "12px",
                  background: listening ? "#241E1A" : "#F0E7D7",
                  border: "none", borderRadius: "50%", width: "40px", height: "40px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: listening ? "#FBF6EC" : "#3D332C",
                }}
              >
                {listening ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
            )}
          </div>
          {listening && (
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", textAlign: "center", margin: "-4px 0 12px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#241E1A", marginRight: "6px" }} />
              듣고 있어요...
            </p>
          )}
          <button
            type="button"
            onClick={handleSendReply}
            disabled={!replyText.trim() && !reaction}
            style={{
              width: "100%", minHeight: "var(--parent-btn-height)",
              background: (!replyText.trim() && !reaction) ? "#D5CFC8" : "#241E1A",
              color: (!replyText.trim() && !reaction) ? "#9A8B7D" : "#FBF6EC",
              border: "none", borderRadius: "999px",
              fontSize: "var(--parent-font-base)", fontWeight: 600,
              cursor: (!replyText.trim() && !reaction) ? "not-allowed" : "pointer",
            }}
          >
            보내기
          </button>
        </>
      )}
    </ParentAppShell>
  );
}
