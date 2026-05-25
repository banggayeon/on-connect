"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { ParentToggle } from "@/components/child/ParentToggle";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { careMessages } from "@/lib/mockData";

export default function SignalRecommendPage() {
  const router = useRouter();
  const { parentProfile } = useSelectedParent();

  const TONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    coral: { bg: "#FFE5DA", text: "#8A3E25", border: "#F5C4B2" },
    honey: { bg: "#FFF1DA", text: "#7A5A1A", border: "#F5E2B2" },
    leaf: { bg: "#E8F3E5", text: "#3A6B3A", border: "#B8D9B8" },
    sky: { bg: "#E0EDF5", text: "#2C5A7A", border: "#B0CCE0" }
  };

  return (
    <DetailScreen title="안부 추천" className="bg-gradient-to-b from-[#FFF1DA] to-white">
      <ParentToggle />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>
          {parentProfile.displayName}에게 보낼 안부
        </p>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#7AB87A", fontWeight: 600 }}>
          <Sparkles size={13} /> AI 추천
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
                background: "white",
                border: `1.5px solid ${tc.border}`,
                borderRadius: "18px",
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <p style={{ fontSize: "16px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
                  {msg.text}
                </p>
                <ChevronRight size={16} style={{ color: "#B07A5C", flexShrink: 0, marginLeft: "8px", marginTop: "2px" }} />
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
                      background: "#E8F3E5",
                      color: "#3A6B3A",
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
