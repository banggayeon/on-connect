"use client";

import { useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";

const GUIDES = [
  {
    period: "1주일 만",
    tag: "가볍게",
    tagTone: "#F6D6BD",
    desc: "시간이 많이 지나지 않아 자연스럽게 시작할 수 있어요.",
    messages: [
      { id: "g1a", text: "엄마 잘 지내셨어요? 요즘 어때요?" },
      { id: "g1b", text: "바빠서 연락 못 드렸어요. 밥은 잘 챙기고 계세요?" }
    ]
  },
  {
    period: "1개월 만",
    tag: "근황 물어보기",
    tagTone: "#F1D6CC",
    desc: "오래된 대화를 다시 연결할 때는 근황을 먼저 물어보는 게 좋아요.",
    messages: [
      { id: "g2a", text: "오랜만이에요 엄마. 요즘은 어떻게 지내세요? 화분은 잘 크고 있어요?" },
      { id: "g2b", text: "한 달이 넘었네요. 잘 지내셨죠? 요즘 허리는 좀 어때요?" }
    ]
  },
  {
    period: "3개월 이상",
    tag: "솔직하게",
    tagTone: "#CDDCC8",
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
    <DetailScreen title="다시 연락하기">
      <div
        style={{
          background: "#F6D6BD",
          borderRadius: "26px",
          padding: "18px 20px",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 4px", fontWeight: 500 }}>
          안부 현황
        </p>
        <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
          {parentProfile.displayName}과 마지막 연락이 4일 전이에요
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {GUIDES.map((guide, idx) => (
          <div
            key={guide.period}
            style={{
              background: "#FFFBF2",
              borderRadius: "22px",
              overflow: "hidden",
              border: "1px solid #E8DECF"
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
                <span style={{ fontSize: "13px", color: "#241E1A", fontWeight: 600 }}>
                  {guide.period}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    background: guide.tagTone,
                    color: "#3D332C",
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
                  color: "#8A6B5C",
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
                        background: selectedMsg === msg.id ? "#241E1A" : "#FAF6EE",
                        border: "none",
                        borderRadius: "18px",
                        padding: "12px 14px",
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "14px",
                        color: selectedMsg === msg.id ? "#FBF6EC" : "#241E1A",
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

      {!sent ? (
        <button
          type="button"
          onClick={() => { if (selectedMsg) setSent(true); }}
          style={{
            width: "100%",
            background: selectedMsg ? "#241E1A" : "#D5CFC8",
            color: selectedMsg ? "#FBF6EC" : "#9A8B7D",
            border: "none",
            borderRadius: "999px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: selectedMsg ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {selectedMsg ? "↑ 이 문장으로 연락하기" : "문장을 선택해주세요"}
        </button>
      ) : (
        <div
          style={{
            background: "#CDDCC8",
            borderRadius: "999px",
            padding: "16px 18px",
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>
            연락을 보냈어요 ✓
          </p>
        </div>
      )}
    </DetailScreen>
  );
}
