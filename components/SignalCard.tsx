const TONE_STYLES = {
  coral: {
    iconBg: "#E07856",
    cardBg: "#FFE5DA",
    textColor: "#3D2419"
  },
  leaf: {
    iconBg: "#7AB87A",
    cardBg: "#E8F3E5",
    textColor: "#1F4A1F"
  },
  sky: {
    iconBg: "#7DA8C8",
    cardBg: "#E0EDF5",
    textColor: "#1A3A55"
  },
  honey: {
    iconBg: "#E8A04E",
    cardBg: "#FFF1DA",
    textColor: "#5F4534"
  }
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
  const toneStyle = TONE_STYLES[tone];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderRadius: "16px",
        padding: "14px 16px",
        background: active
          ? "linear-gradient(135deg, #FF8A65, #E07856)"
          : toneStyle.cardBg,
        boxShadow: active ? "0 4px 12px rgba(224,120,86,0.22)" : "none"
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: active ? "rgba(255,255,255,0.28)" : toneStyle.iconBg,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: active ? "white" : "rgba(255,255,255,0.9)"
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: active ? "white" : toneStyle.textColor,
            margin: "0 0 3px",
            lineHeight: 1.35
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "13px",
            color: active ? "rgba(255,255,255,0.82)" : "#8A6B5C",
            margin: 0
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
