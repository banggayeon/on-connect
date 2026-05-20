type ParentTemperature = {
  parentId: string;
  displayName: string;
  temperature: number;
  label: string;
  delta: number;
  reasons: string[];
};

const CARD_STYLES = [
  {
    background: "linear-gradient(135deg, #FF8A65 0%, #FFB088 100%)",
    shadow: "0 8px 24px rgba(224,120,86,0.28)",
    labelColor: "rgba(255,255,255,0.88)",
    tempColor: "white",
    stateColor: "rgba(255,255,255,0.85)",
    deltaBg: "rgba(255,255,255,0.22)",
    deltaColor: "white",
    progressTrack: "rgba(255,255,255,0.28)",
    progressFill: "white",
    reasonColor: "rgba(255,255,255,0.88)"
  },
  {
    background: "linear-gradient(135deg, #E8A04E 0%, #FFD9B8 100%)",
    shadow: "0 4px 14px rgba(232,160,78,0.22)",
    labelColor: "#7A5A1A",
    tempColor: "#3D2419",
    stateColor: "#8A6B5C",
    deltaBg: "rgba(255,255,255,0.5)",
    deltaColor: "#7A5A1A",
    progressTrack: "rgba(255,255,255,0.45)",
    progressFill: "rgba(255,255,255,0.88)",
    reasonColor: "#5F4534"
  }
];

function formatDelta(delta: number) {
  return delta > 0 ? `+${delta}°` : `${delta}°`;
}

function tempToPercent(temp: number) {
  return Math.min(100, Math.max(10, ((temp - 33) / (38.5 - 33)) * 100));
}

export function RelationshipTemperatureGrid({ temperatures }: { temperatures: ParentTemperature[] }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {temperatures.map((parent, index) => {
        const s = CARD_STYLES[Math.min(index, CARD_STYLES.length - 1)];
        const progress = tempToPercent(parent.temperature);

        return (
          <div
            key={parent.parentId}
            style={{
              background: s.background,
              borderRadius: "20px",
              padding: "18px 20px",
              boxShadow: s.shadow
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: s.labelColor, fontWeight: 500 }}>
                {parent.displayName}와의 연결
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: s.deltaColor,
                  background: s.deltaBg,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontWeight: 600
                }}
              >
                {formatDelta(parent.delta)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "10px" }}>
              <span style={{ fontSize: "38px", fontWeight: 500, color: s.tempColor, lineHeight: 1 }}>
                {parent.temperature.toFixed(1)}°
              </span>
              <span style={{ fontSize: "13px", color: s.stateColor }}>{parent.label}</span>
            </div>

            <div
              style={{
                height: "4px",
                background: s.progressTrack,
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: s.progressFill,
                  borderRadius: "999px"
                }}
              />
            </div>

            <p style={{ fontSize: "13px", color: s.reasonColor, lineHeight: 1.5, margin: 0 }}>
              {parent.reasons[0]}
            </p>
          </div>
        );
      })}
    </section>
  );
}
