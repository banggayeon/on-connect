type ParentTemperature = {
  parentId: string;
  displayName: string;
  temperature: number;
  label: string;
  delta: number;
  reasons: string[];
};

const CARD_TONES = ["#F1D6CC", "#CDDCC8"]; // blush, mint

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
        const tone = CARD_TONES[Math.min(index, CARD_TONES.length - 1)];
        const progress = tempToPercent(parent.temperature);

        return (
          <div
            key={parent.parentId}
            style={{
              background: tone,
              borderRadius: "26px",
              padding: "18px 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "#3D332C", fontWeight: 500 }}>
                {parent.displayName}와의 연결
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#241E1A",
                  background: "rgba(255,255,255,0.5)",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontWeight: 600
                }}
              >
                {formatDelta(parent.delta)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "10px" }}>
              <span style={{ fontSize: "38px", fontWeight: 600, color: "#241E1A", lineHeight: 1 }}>
                {parent.temperature.toFixed(1)}°
              </span>
              <span style={{ fontSize: "13px", color: "#3D332C" }}>{parent.label}</span>
            </div>

            <div
              style={{
                height: "4px",
                background: "rgba(255,255,255,0.5)",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#241E1A",
                  borderRadius: "999px"
                }}
              />
            </div>

            <p style={{ fontSize: "13px", color: "#3D332C", lineHeight: 1.5, margin: 0 }}>
              {parent.reasons[0]}
            </p>
          </div>
        );
      })}
    </section>
  );
}
