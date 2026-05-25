"use client";

import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { demoDataset } from "@/lib/demoDataset";

const PARENT_TONES = ["#F1D6CC", "#CDDCC8"];

export function ParentToggle({ variant = "coral" }: { variant?: "coral" | "green" | "sky" }) {
  const { selectedParentId, setSelectedParentId } = useSelectedParent();

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
      {demoDataset.parents.map((parent, index) => {
        const isActive = parent.id === selectedParentId;
        return (
          <button
            key={parent.id}
            type="button"
            onClick={() => setSelectedParentId(parent.id as "parent_mother" | "parent_father")}
            style={{
              background: isActive ? "#F1E5C8" : PARENT_TONES[index] ?? "#FFFBF2",
              color: "#241E1A",
              border: isActive ? "2px solid #6E4A39" : "none",
              borderRadius: "999px",
              padding: isActive ? "8px 21px" : "9px 22px",
              fontSize: "14px",
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s"
            }}
          >
            {parent.displayName}
          </button>
        );
      })}
    </div>
  );
}
