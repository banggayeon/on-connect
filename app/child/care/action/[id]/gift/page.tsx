"use client";

import { Gift, Sparkles } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { giftRecommendations } from "@/lib/mockData";

export default function CareActionGiftPage({ params }: { params: { id: string } }) {
  const { parentProfile } = useSelectedParent();
  const isMom = parentProfile.id === "parent_mother";

  const items = isMom ? giftRecommendations.items.slice(0, 2) : giftRecommendations.items.slice(1);

  return (
    <DetailScreen title="선물 옵션" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 안내 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 6px", fontWeight: 500 }}>
          선물보다 먼저
        </p>
        <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>
          {parentProfile.displayName}이 부담 없이 받을 수 있는지 먼저 확인해보세요.
        </p>
      </div>

      {/* 추천 선물 리스트 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>맞춤 추천</p>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#7AB87A", fontWeight: 600 }}>
          <Sparkles size={12} /> AI
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {items.map((gift) => (
          <div
            key={gift.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
              display: "flex",
              gap: "14px"
            }}
          >
            <span
              className={`bg-gradient-to-br ${gift.gradientClass}`}
              style={{ width: "64px", height: "64px", borderRadius: "14px", flexShrink: 0, display: "block" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "16px", color: "#3D2419", margin: "0 0 4px", fontWeight: 600 }}>{gift.name}</p>
              <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 6px" }}>{gift.meta}</p>
              <span
                style={{
                  display: "inline-block",
                  background: "#FBF6F0",
                  borderRadius: "999px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  color: "#B07A5C",
                  fontWeight: 500
                }}
              >
                {gift.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 추천 이유 */}
      <div
        style={{
          background: "#E8F3E5",
          borderRadius: "16px",
          padding: "16px 18px",
          marginBottom: "16px"
        }}
      >
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#3A6B3A",
            margin: "0 0 8px",
            fontWeight: 600
          }}
        >
          <Gift size={15} /> {giftRecommendations.recommendationReasonTitle}
        </p>
        <p style={{ fontSize: "14px", color: "#1F4A1F", margin: 0, lineHeight: 1.55 }}>
          {giftRecommendations.recommendationReason}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
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
          boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
        }}
      >
        {giftRecommendations.ctaLabel}
      </button>
    </DetailScreen>
  );
}
