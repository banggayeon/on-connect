"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { careMessages } from "@/lib/mockData";

const TONE_VARIANTS: Record<string, { label: string; suffix: string }> = {
  "다정하게": { label: "다정하게", suffix: " 오늘도 생각나서 연락드렸어요." },
  "가볍게":   { label: "가볍게",   suffix: " 오늘 하루도 편안히 보내세요." },
  "격식":     { label: "격식 있게", suffix: " 편안히 지내고 계시지요?" }
};

export default function SignalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const signal = careMessages.suggestions.find((s) => s.id === id) ?? careMessages.suggestions[0];
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const displayText = selectedTone
    ? signal.text + TONE_VARIANTS[selectedTone]?.suffix
    : signal.text;

  return (
    <DetailScreen title="안부 추천">
      {/* 추천 문장 */}
      <div
        style={{
          background: "#F6D6BD",
          borderRadius: "26px",
          padding: "24px 22px",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 10px", fontWeight: 500 }}>
          추천 안부 문장
        </p>
        <p style={{ fontSize: "20px", color: "#241E1A", margin: 0, fontWeight: 700, lineHeight: 1.4, letterSpacing: "-0.02em" }}>
          &quot;{displayText}&quot;
        </p>
      </div>

      {/* 추천 이유 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>추천 이유</p>
        <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.55 }}>{signal.helper}</p>
      </div>

      {/* 톤 변경 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>톤 변경</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {Object.entries(TONE_VARIANTS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTone(selectedTone === key ? null : key)}
              style={{
                flex: 1,
                background: selectedTone === key ? "#241E1A" : "#F0E7D7",
                color: selectedTone === key ? "#FBF6EC" : "#3D332C",
                border: "none",
                borderRadius: "999px",
                padding: "10px 8px",
                fontSize: "13px",
                fontWeight: selectedTone === key ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* 보내기 버튼 */}
      {!sent ? (
        <button
          type="button"
          onClick={() => setSent(true)}
          style={{
            width: "100%",
            background: "#241E1A",
            color: "#FBF6EC",
            border: "none",
            borderRadius: "999px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "12px"
          }}
        >
          ↑ 이 안부 보내기
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
          <div
            style={{
              background: "#CDDCC8",
              borderRadius: "999px",
              padding: "16px 18px",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>안부를 보냈어요 ✓</p>
          </div>

          {/* Warm Reply — post-send only */}
          <button
            type="button"
            onClick={() => router.push(`/child/signal/recommend/${id}/reply`)}
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
            <div>
              <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 2px", fontWeight: 500 }}>
                부모님이 이렇게 답하시면?
              </p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>Warm Reply — 후속 답장 추천</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </DetailScreen>
  );
}
