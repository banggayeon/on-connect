const TONE_STYLES = {
  coral: { cardBg: "#F0C2AC" },
  leaf:  { cardBg: "#CDDCC8" },
  sky:   { cardBg: "#D9D0E5" },
  honey: { cardBg: "#F6D6BD" }
};

export function SignalCard({
  title,
  subtitle,
  tone = "coral",
  active = false
}: {
  title: string;
  subtitle: string;
  tone?: "coral" | "leaf" | "sky" | "honey";
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        borderRadius: "18px",
        padding: "16px 18px",
        background: active ? "#241E1A" : TONE_STYLES[tone].cardBg
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: active ? "rgba(251,246,236,0.7)" : "rgba(36,30,26,0.35)",
          flexShrink: 0
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: active ? "#FBF6EC" : "#241E1A",
            margin: "0 0 3px",
            lineHeight: 1.35,
            letterSpacing: "-0.012em"
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "13px",
            color: active ? "rgba(251,246,236,0.72)" : "#8A6B5C",
            margin: 0
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
