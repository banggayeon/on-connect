"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Send } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { careMessages } from "@/lib/mockData";

const TONE_VARIANTS: Record<string, { label: string; suffix: string }> = {
  "다정하게": {
    label: "다정하게",
    suffix: " 오늘도 생각나서 연락드렸어요."
  },
  "가볍게": {
    label: "가볍게",
    suffix: " 오늘 하루도 편안히 보내세요."
  },
  "격식": {
    label: "격식 있게",
    suffix: " 편안히 지내고 계시지요?"
  }
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
    <DetailScreen title="안부 추천" className="bg-gradient-to-b from-[#FFF1DA] to-white">
      {/* 추천 문장 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF8A65, #E07856)",
          borderRadius: "22px",
          padding: "24px 22px",
          marginBottom: "16px",
          boxShadow: "0 10px 24px rgba(224,120,86,0.28)"
        }}
      >
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.88)", margin: "0 0 10px", fontWeight: 500 }}>
          추천 안부 문장
        </p>
        <p style={{ fontSize: "20px", color: "white", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
          &quot;{displayText}&quot;
        </p>
      </div>

      {/* 추천 이유 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>추천 이유</p>
        <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, lineHeight: 1.55 }}>{signal.helper}</p>
      </div>

      {/* 톤 변경 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>톤 변경</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {Object.entries(TONE_VARIANTS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTone(selectedTone === key ? null : key)}
              style={{
                flex: 1,
                background: selectedTone === key ? "linear-gradient(135deg, #FF8A65, #E07856)" : "#FBF6F0",
                color: selectedTone === key ? "white" : "#8A6B5C",
                border: "none",
                borderRadius: "12px",
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
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
            color: "white",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 8px 20px rgba(224,120,86,0.28)",
            marginBottom: "12px"
          }}
        >
          <Send size={18} /> 이 안부 보내기
        </button>
      ) : (
        <div
          style={{
            background: "#E8F3E5",
            borderRadius: "16px",
            padding: "16px 18px",
            textAlign: "center",
            marginBottom: "12px"
          }}
        >
          <p style={{ fontSize: "15px", color: "#1F4A1F", margin: 0, fontWeight: 600 }}>안부를 보냈어요 ✓</p>
        </div>
      )}

      {/* Warm Reply 섹션 */}
      <button
        type="button"
        onClick={() => router.push(`/child/signal/recommend/${id}/reply`)}
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
        <div>
          <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
            부모님이 이렇게 답하시면?
          </p>
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>Warm Reply — 후속 답장 추천</p>
        </div>
        <ChevronRight size={16} style={{ color: "#B07A5C" }} />
      </button>
    </DetailScreen>
  );
}
