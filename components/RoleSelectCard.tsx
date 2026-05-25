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
        "rounded-[24px] p-[22px] flex items-center justify-between gap-4 text-left w-full transition-[background-color,border-color] duration-[120ms]",
        selected
          ? "bg-[#F1E5C8] border-2 border-[#6E4A39]"
          : "bg-[#FFFBF2] border border-[#E8DECF]"
      )}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "999px",
            background: TONE_STYLES[tone],
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
            color: "#241E1A"
          }}
        >
          {badge}
        </div>
        <div>
          <p style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#241E1A",
            margin: "0 0 3px"
          }}>
            {label}
          </p>
          <p style={{
            fontSize: "13.5px",
            color: selected ? "#6E4A39" : "#8A6B5C",
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
          border: `2px solid ${selected ? "#6E4A39" : "#D5C9BB"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {selected && (
          <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#6E4A39" }} />
        )}
      </div>
    </div>
  );
}
