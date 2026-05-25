import { relationshipTemperature } from "@/lib/mockData";

export function TemperatureCard() {
  return (
    <section
      style={{
        background: "#D8E0A6",
        borderRadius: "26px",
        padding: "24px 24px 22px"
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "12.5px", color: "#3D332C", margin: 0, fontWeight: 500, letterSpacing: "-0.005em" }}>
          {relationshipTemperature.label}
        </p>
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "-0.022em",
          lineHeight: 1.32,
          margin: "8px 0 22px",
          color: "#241E1A"
        }}
      >
        {relationshipTemperature.stateText}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "14px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(36,30,26,0.16)"
        }}
      >
        <span style={{ fontSize: "12px", color: "#241E1A", opacity: 0.7 }}>관계 온도</span>
        <strong style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em", color: "#241E1A" }}>
          {relationshipTemperature.valueText}
        </strong>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#241E1A", opacity: 0.65 }}>
          {relationshipTemperature.deltaText}
        </span>
      </div>
    </section>
  );
}
