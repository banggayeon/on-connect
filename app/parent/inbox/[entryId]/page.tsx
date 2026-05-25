"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, MicOff } from "lucide-react";
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
  const [reactionToast, setReactionToast] = useState(false);
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

  function handleReaction(key: Reaction) {
    setReaction(key);
    setReactionToast(true);
    setTimeout(() => setReactionToast(false), 2000);
  }

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
        <p style={{ fontSize: "var(--parent-font-base)", color: "#B07A5C", textAlign: "center", paddingTop: "60px" }}>
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
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          {entry.senderName}이의 안부
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 12px" }}>
        {formatDate(entry.date)}
      </p>

      {/* 사진 (있으면) */}
      {entry.imageUrl && (
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
          <img src={entry.imageUrl} alt="안부 사진" style={{ width: "100%", display: "block" }} />
        </div>
      )}

      {/* 안부 텍스트 */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(61,36,25,0.06)" }}>
        <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: 0, lineHeight: 1.7 }}>
          {entry.text}
        </p>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #FFE4CC", marginBottom: "20px" }} />

      {/* 퀵 리액션 */}
      <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>
        빠른 반응 보내기
      </p>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {REACTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleReaction(key)}
            style={{
              flex: 1, minHeight: "var(--parent-btn-height)",
              background: reaction === key ? "#FFEDE0" : "white",
              border: reaction === key ? "2px solid #FF8A65" : "1px solid #FFE4CC",
              borderRadius: "14px", fontSize: "var(--parent-font-caption)",
              color: reaction === key ? "#E07856" : "#6B4C3B",
              fontWeight: reaction === key ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {reactionToast && (
        <p style={{ fontSize: "var(--parent-font-caption)", color: "#FF8A65", textAlign: "center", margin: "-12px 0 12px", fontWeight: 500 }}>
          전달했어요! ✓
        </p>
      )}

      {/* 답장 영역 */}
      <p style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>
        답장 쓰기
      </p>

      {replySent ? (
        <div style={{ background: "#FFF8F0", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#FF8A65", margin: 0, fontWeight: 600 }}>
            답장을 전달했어요! 💛
          </p>
        </div>
      ) : (
        <>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답장을 적어보세요"
              style={{
                width: "100%", minHeight: "120px", fontSize: "var(--parent-font-base)",
                border: "1px solid #FFCBB0", borderRadius: "16px", padding: "16px",
                paddingRight: speechSupported ? "52px" : "16px",
                resize: "none", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", color: "#3D2419", lineHeight: 1.6,
              }}
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                style={{
                  position: "absolute", right: "12px", bottom: "12px",
                  background: listening ? "#FF8A65" : "#FFEDE0",
                  border: "none", borderRadius: "50%", width: "40px", height: "40px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: listening ? "white" : "#E07856",
                }}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
          </div>
          {listening && (
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#FF8A65", textAlign: "center", margin: "-4px 0 12px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#FF8A65", marginRight: "6px", animation: "pulse 1s infinite" }} />
              듣고 있어요...
            </p>
          )}
          <button
            type="button"
            onClick={handleSendReply}
            style={{
              width: "100%", minHeight: "var(--parent-btn-height)",
              background: "linear-gradient(135deg, #FF8A65, #E07856)",
              color: "white", border: "none", borderRadius: "16px",
              fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
            }}
          >
            보내기
          </button>
        </>
      )}
    </ParentAppShell>
  );
}
