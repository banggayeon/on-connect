"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";

const GUIDES = [
  {
    period: "1주일 만",
    days: 7,
    tag: "가볍게",
    tagColor: { bg: "#FFF1DA", text: "#7A5A1A" },
    desc: "시간이 많이 지나지 않아 자연스럽게 시작할 수 있어요.",
    messages: [
      { id: "g1a", text: "엄마 잘 지내셨어요? 요즘 어때요?" },
      { id: "g1b", text: "바빠서 연락 못 드렸어요. 밥은 잘 챙기고 계세요?" }
    ]
  },
  {
    period: "1개월 만",
    days: 30,
    tag: "근황 물어보기",
    tagColor: { bg: "#FFE5DA", text: "#8A3E25" },
    desc: "오래된 대화를 다시 연결할 때는 근황을 먼저 물어보는 게 좋아요.",
    messages: [
      { id: "g2a", text: "오랜만이에요 엄마. 요즘은 어떻게 지내세요? 화분은 잘 크고 있어요?" },
      { id: "g2b", text: "한 달이 넘었네요. 잘 지내셨죠? 요즘 허리는 좀 어때요?" }
    ]
  },
  {
    period: "3개월 이상",
    days: 90,
    tag: "솔직하게",
    tagColor: { bg: "#E8F3E5", text: "#3A6B3A" },
    desc: "오래 연락이 끊겼을 때는 솔직하게 먼저 말씀드리는 게 더 따뜻하게 느껴질 수 있어요.",
    messages: [
      { id: "g3a", text: "요즘 연락 못 드려서 죄송해요 엄마. 잘 지내고 계시죠?" },
      { id: "g3b", text: "오랜만에 연락해서 미안해요. 한 번 뵙고 싶어요." }
    ]
  }
];

export default function FirstContactPage() {
  const { parentProfile } = useSelectedParent();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <DetailScreen title="다시 연락하기" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 현황 표시 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
          borderRadius: "18px",
          padding: "18px 20px",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#8A3E25", margin: "0 0 4px", fontWeight: 500 }}>
          안부 현황
        </p>
        <p style={{ fontSize: "16px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
          {parentProfile.displayName}과 마지막 연락이 4일 전이에요
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {GUIDES.map((guide, idx) => (
          <div
            key={guide.period}
            style={{
              background: "white",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={{
                width: "100%",
                padding: "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#3D2419",
                    fontWeight: 600
                  }}
                >
                  {guide.period}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    background: guide.tagColor.bg,
                    color: guide.tagColor.text,
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontWeight: 500
                  }}
                >
                  {guide.tag}
                </span>
              </div>
              <span
                style={{
                  fontSize: "14px",
                  color: "#B07A5C",
                  transform: openIdx === idx ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                  display: "inline-block"
                }}
              >
                ›
              </span>
            </button>

            {openIdx === idx && (
              <div style={{ padding: "0 18px 16px" }}>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", lineHeight: 1.5 }}>
                  {guide.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {guide.messages.map((msg) => (
                    <button
                      key={msg.id}
                      type="button"
                      onClick={() => setSelectedMsg(selectedMsg === msg.id ? null : msg.id)}
                      style={{
                        background: selectedMsg === msg.id ? "#FFF1DA" : "#FBF6F0",
                        border: selectedMsg === msg.id ? "2px solid #E8A04E" : "1.5px solid transparent",
                        borderRadius: "14px",
                        padding: "12px 14px",
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "14px",
                        color: "#3D2419",
                        lineHeight: 1.5
                      }}
                    >
                      &quot;{msg.text}&quot;
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 전송 */}
      {!sent ? (
        <button
          type="button"
          onClick={() => { if (selectedMsg) setSent(true); }}
          style={{
            width: "100%",
            background: selectedMsg
              ? "linear-gradient(135deg, #FF8A65, #E07856)"
              : "#F0E4D8",
            color: selectedMsg ? "white" : "#B07A5C",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: selectedMsg ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: selectedMsg ? "0 8px 20px rgba(224,120,86,0.28)" : "none"
          }}
        >
          <Send size={18} />
          {selectedMsg ? "이 문장으로 연락하기" : "문장을 선택해주세요"}
        </button>
      ) : (
        <div
          style={{
            background: "#E8F3E5",
            borderRadius: "16px",
            padding: "16px 18px",
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: "15px", color: "#1F4A1F", margin: 0, fontWeight: 600 }}>
            연락을 보냈어요 ✓
          </p>
        </div>
      )}
    </DetailScreen>
  );
}
