"use client";

import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { demoDataset } from "@/lib/demoDataset";

export function ParentToggle({ variant = "coral" }: { variant?: "coral" | "green" | "sky" }) {
  const { selectedParentId, setSelectedParentId } = useSelectedParent();

  const activeColors = {
    coral: {
      mom: "linear-gradient(135deg, #FF8A65, #E07856)",
      dad: "linear-gradient(135deg, #E8A04E, #D4883A)",
      momShadow: "0 4px 12px rgba(224,120,86,0.25)",
      dadShadow: "0 4px 12px rgba(232,160,78,0.25)"
    },
    green: {
      mom: "linear-gradient(135deg, #7AB87A, #5A9E5A)",
      dad: "linear-gradient(135deg, #7DA8C8, #5A8AB0)",
      momShadow: "0 4px 12px rgba(122,184,122,0.3)",
      dadShadow: "0 4px 12px rgba(125,168,200,0.3)"
    },
    sky: {
      mom: "linear-gradient(135deg, #FF8A65, #E07856)",
      dad: "linear-gradient(135deg, #E8A04E, #D4883A)",
      momShadow: "0 4px 12px rgba(224,120,86,0.25)",
      dadShadow: "0 4px 12px rgba(232,160,78,0.25)"
    }
  };

  const colors = activeColors[variant];

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
      {demoDataset.parents.map((parent) => {
        const isActive = parent.id === selectedParentId;
        const isMom = parent.id === demoDataset.parents[0].id;
        return (
          <button
            key={parent.id}
            type="button"
            onClick={() => setSelectedParentId(parent.id as "parent_mother" | "parent_father")}
            style={{
              background: isActive ? (isMom ? colors.mom : colors.dad) : "white",
              color: isActive ? "white" : "#8A6B5C",
              border: isActive ? "none" : "1.5px solid #F0E4D8",
              borderRadius: "999px",
              padding: "9px 22px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: isActive ? (isMom ? colors.momShadow : colors.dadShadow) : "none",
              transition: "all 0.18s"
            }}
          >
            {parent.displayName}
          </button>
        );
      })}
    </div>
  );
}
