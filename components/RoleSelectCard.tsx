import { cn } from "@/lib/utils";

const TONE_STYLES = {
  parent: "#F1D6CC",
  child:  "#CDDCC8"
};

export function RoleSelectCard({
  label,
  description,
  badge,
  selected,
  tone
}: {
  label: string;
  description: string;
  badge: string;
  selected?: boolean;
  tone: "parent" | "child";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] p-[22px] flex items-center justify-between gap-4 text-left w-full",
        selected ? "bg-[#241E1A]" : "bg-[#FFFBF2] border border-[#E8DECF]"
      )}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "999px",
            background: selected ? "rgba(251,246,236,0.18)" : TONE_STYLES[tone],
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
            color: selected ? "transparent" : "#241E1A"
          }}
        >
          {!selected && badge}
        </div>
        <div>
          <p style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: selected ? "#FBF6EC" : "#241E1A",
            margin: "0 0 3px"
          }}>
            {label}
          </p>
          <p style={{
            fontSize: "13.5px",
            color: selected ? "rgba(251,246,236,0.72)" : "#8A6B5C",
            margin: 0,
            letterSpacing: "-0.01em"
          }}>
            {description}
          </p>
        </div>
      </div>
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "999px",
          border: `1.5px solid ${selected ? "#FBF6EC" : "#241E1A"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: selected ? 1 : 0.35,
          flexShrink: 0
        }}
      >
        {selected && (
          <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#FBF6EC" }} />
        )}
      </div>
    </div>
  );
}
