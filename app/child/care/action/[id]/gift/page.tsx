"use client";

import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { giftRecommendations } from "@/lib/mockData";

const GIFT_TONES = ["#F1D6CC", "#CDDCC8", "#D9D0E5", "#F6D6BD"];

export default function CareActionGiftPage() {
  const { parentProfile } = useSelectedParent();
  const isMom = parentProfile.id === "parent_mother";

  const items = isMom ? giftRecommendations.items.slice(0, 2) : giftRecommendations.items.slice(1);

  return (
    <DetailScreen title="선물 옵션">
      {/* 안내 */}
      <div
        style={{
          background: "#F1D6CC",
          borderRadius: "26px",
          padding: "18px",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 6px", fontWeight: 500 }}>
          선물보다 먼저
        </p>
        <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
          {parentProfile.displayName}이 부담 없이 받을 수 있는지 먼저 확인해보세요.
        </p>
      </div>

      {/* 추천 선물 리스트 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>맞춤 추천</p>
        <span style={{ fontSize: "11px", color: "#241E1A", background: "#D8E0A6", padding: "3px 8px", borderRadius: "999px", fontWeight: 600 }}>
          AI
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {items.map((gift, idx) => (
          <div
            key={gift.id}
            style={{
              background: "#FFFBF2",
              borderRadius: "22px",
              padding: "14px",
              border: "1px solid #E8DECF",
              display: "flex",
              gap: "14px"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: GIFT_TONES[idx % GIFT_TONES.length],
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}
            >
              🎁
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "16px", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>{gift.name}</p>
              <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 6px" }}>{gift.meta}</p>
              <span
                style={{
                  display: "inline-block",
                  background: "#F0E7D7",
                  borderRadius: "999px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  color: "#3D332C",
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
          background: "#D8E0A6",
          borderRadius: "22px",
          padding: "16px 18px",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 8px", fontWeight: 600 }}>
          🎁 {giftRecommendations.recommendationReasonTitle}
        </p>
        <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.55 }}>
          {giftRecommendations.recommendationReason}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        style={{
          width: "100%",
          background: "#241E1A",
          color: "#FBF6EC",
          border: "none",
          borderRadius: "999px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {giftRecommendations.ctaLabel}
      </button>
    </DetailScreen>
  );
}
