"use client";

import { useState } from "react";
import type { CheckInSuggestion } from "@/lib/types";

interface CheckInCardProps {
  suggestion: CheckInSuggestion;
  onSend: (suggestion: CheckInSuggestion) => void;
  sent?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  weather: "#D8E0A6",
  routine: "#F1D6CC",
  memory: "#CDDCC8",
  care: "#F6D6BD",
  light: "#EDE0F5",
};

export function CheckInCard({ suggestion, onSend, sent = false }: CheckInCardProps) {
  const [polishing, setPolishing] = useState(false);
  const [polishedMessage, setPolishedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const displayMessage = polishedMessage ?? suggestion.message;
  const cardBg = CATEGORY_COLORS[suggestion.category] ?? "#F0E7D7";

  function handlePolish() {
    setPolishing(true);
    setTimeout(() => {
      // Mock polish: add a warm suffix
      setPolishedMessage(displayMessage + " 편안히 쉬세요 🌿");
      setPolishing(false);
    }, 900);
  }

  function handleCopy() {
    navigator.clipboard.writeText(displayMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      background: cardBg,
      borderRadius: "20px",
      padding: "18px 18px 16px",
      marginBottom: "12px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6E4A39" }}>{suggestion.title}</span>
        {suggestion.bestTimeLabel && (
          <span style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
            background: "rgba(255,255,255,0.55)", color: "#6E4A39"
          }}>
            {suggestion.bestTimeLabel}
          </span>
        )}
      </div>

      {/* Message */}
      <p style={{
        fontSize: "16px", fontWeight: 600, color: "#241E1A",
        lineHeight: 1.5, margin: "0 0 8px", letterSpacing: "-0.01em"
      }}>
        &ldquo;{displayMessage}&rdquo;
      </p>

      {/* Reason */}
      <p style={{ fontSize: "12.5px", color: "#5C4A3B", margin: "0 0 12px", lineHeight: 1.55 }}>
        {suggestion.reason}
      </p>

      {/* Context tags */}
      {suggestion.contextTags.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
          {suggestion.contextTags.map((tag) => (
            <span key={tag} style={{
              fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
              background: "rgba(255,255,255,0.5)", color: "#5C4A3B"
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {sent ? (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 14px", borderRadius: "12px",
          background: "rgba(255,255,255,0.5)"
        }}>
          <span style={{ fontSize: "13px", color: "#3D332C" }}>부모님 화면에 안부가 전달됐어요.</span>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              marginLeft: "auto", fontSize: "12px", padding: "5px 14px",
              borderRadius: "999px", border: "1px solid #9A8B7D",
              background: "transparent", color: "#6E4A39", cursor: "pointer"
            }}
          >
            {copied ? "복사됨" : "복사하기"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onSend(suggestion)}
            style={{
              flex: 1, background: "#241E1A", color: "#FBF6EC",
              border: "none", borderRadius: "999px",
              padding: "13px", fontSize: "14px", fontWeight: 600,
              cursor: "pointer"
            }}
          >
            이 안부 보내기
          </button>
          <button
            type="button"
            onClick={handlePolish}
            disabled={polishing || polishedMessage !== null}
            style={{
              padding: "13px 16px", borderRadius: "999px",
              border: "1px solid #9A8B7D", background: "transparent",
              color: "#6E4A39", fontSize: "13px", cursor: "pointer",
              opacity: polishing || polishedMessage !== null ? 0.5 : 1,
            }}
          >
            {polishing ? "…" : polishedMessage ? "다듬어짐" : "문장 다듬기"}
          </button>
        </div>
      )}
    </div>
  );
}
