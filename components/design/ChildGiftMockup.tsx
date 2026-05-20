"use client";

import { useMemo } from "react";
import { useState } from "react";
import { AppScreen } from "@/components/AppScreen";
import { giftRecommendations } from "@/lib/mockData";

type SelectedGift = (typeof giftRecommendations.items)[number];

export function ChildGiftMockup({ html }: { html: string }) {
  const [selectedGift, setSelectedGift] = useState<SelectedGift | null>(null);
  const enhancedHtml = useMemo(() => {
    return giftRecommendations.items.reduce((result, item) => {
      return result.replace(
        `>${item.name}</p>`,
        `><span style="display: inline-block; font-size: 12px; color: #3A6B3A; background: #E8F3E5; padding: 5px 8px; border-radius: 999px; margin-bottom: 6px; font-weight: 500;">AI 추천</span><br/>${item.name}</p>`
      );
    }, html);
  }, [html]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    let node: HTMLElement | null = target;

    while (node && node !== event.currentTarget) {
      const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
      const gift = giftRecommendations.items.find((item) => text.includes(item.name));

      if (gift) {
        setSelectedGift(gift);
        return;
      }

      node = node.parentElement;
    }
  }

  return (
    <AppScreen style={{ position: "relative" }}>
      <div
        style={{
          minHeight: "100vh"
        }}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: enhancedHtml }}
      />

      {selectedGift ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedGift(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,36,32,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 20
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(330px, 100%)",
              background: "#FFF8F0",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 10px 24px rgba(61, 36, 25, 0.16)"
            }}
          >
            <p style={{ fontSize: "10px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>
              {giftRecommendations.recommendationReasonTitle}
            </p>
            <p style={{ fontSize: "13px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500 }}>{selectedGift.name}</p>
            <p style={{ fontSize: "10px", color: "#8A6B5C", margin: "0 0 10px", lineHeight: 1.6 }}>{selectedGift.aiReason}</p>
            <div style={{ background: "#E8F3E5", borderRadius: "12px", padding: "12px" }}>
              <p style={{ fontSize: "10px", color: "#3A6B3A", margin: "0 0 4px", fontWeight: 500 }}>{giftRecommendations.careActionTitle}</p>
              <p style={{ fontSize: "10px", color: "#1F4A1F", margin: 0, lineHeight: 1.6 }}>{selectedGift.careAction}</p>
            </div>
            <button
              onClick={() => setSelectedGift(null)}
              style={{
                marginTop: "12px",
                width: "100%",
                minHeight: "48px",
                border: 0,
                background: "linear-gradient(135deg, #FF8A65, #E07856)",
                borderRadius: "10px",
                padding: "14px",
                color: "white",
                fontSize: "15px",
                fontWeight: 500
              }}
            >
              확인
            </button>
          </div>
        </div>
      ) : null}
    </AppScreen>
  );
}
