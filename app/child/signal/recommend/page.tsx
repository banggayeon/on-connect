"use client";

import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { ParentToggle } from "@/components/child/ParentToggle";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { careMessages } from "@/lib/mockData";

const TONE_COLORS: Record<string, { bg: string; text: string }> = {
  coral: { bg: "#F1D6CC", text: "#6E4A39" },
  honey: { bg: "#F6D6BD", text: "#6E4A39" },
  leaf:  { bg: "#CDDCC8", text: "#3D332C" },
  sky:   { bg: "#D9D0E5", text: "#3D332C" }
};

export default function SignalRecommendPage() {
  const router = useRouter();
  const { parentProfile } = useSelectedParent();

  return (
    <DetailScreen title="안부 추천">
      <ParentToggle />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, fontWeight: 500 }}>
          {parentProfile.displayName}에게 보낼 안부
        </p>
        <span style={{ fontSize: "12px", color: "#241E1A", background: "#D8E0A6", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>
          AI 추천
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {careMessages.suggestions.map((msg) => {
          const tc = TONE_COLORS[msg.tone] ?? TONE_COLORS.coral;
          return (
            <button
              key={msg.id}
              type="button"
              onClick={() => router.push(`/child/signal/recommend/${msg.id}`)}
              style={{
                background: "#FFFBF2",
                border: "1px solid #E8DECF",
                borderRadius: "22px",
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
                  {msg.text}
                </p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: "8px", marginTop: "2px" }}>
                  <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    background: tc.bg,
                    color: tc.text,
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontWeight: 500
                  }}
                >
                  {msg.helper}
                </span>
                {msg.active && (
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#D8E0A6",
                      color: "#241E1A",
                      borderRadius: "999px",
                      padding: "3px 8px",
                      fontWeight: 600
                    }}
                  >
                    추천
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </DetailScreen>
  );
}
