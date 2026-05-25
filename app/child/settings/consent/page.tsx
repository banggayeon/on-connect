import { DetailScreen } from "@/components/child/DetailScreen";
import { consentSharing } from "@/lib/mockData";

export default function ConsentPage() {
  return (
    <DetailScreen title="동의 관리">
      {/* 안내 배너 */}
      <div
        style={{
          background: "#CDDCC8",
          borderRadius: "26px",
          padding: "18px",
          marginBottom: "20px",
          display: "flex",
          gap: "12px"
        }}
      >
        <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>🛡</span>
        <div>
          <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 6px", fontWeight: 600 }}>
            {consentSharing.childNoticeTitle}
          </p>
          <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
            {consentSharing.childNoticeBody}
          </p>
        </div>
      </div>

      {/* 항목 리스트 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 14px", fontWeight: 500 }}>공유 항목 (읽기 전용)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {consentSharing.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                background: "#FAF6EE",
                borderRadius: "18px"
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{item.label}</p>
                  <span
                    style={{
                      fontSize: "12px",
                      color: item.enabled ? "#3D332C" : "#8A6B5C",
                      fontWeight: 600,
                      background: item.enabled ? "#D8E0A6" : "#F0E7D7",
                      padding: "2px 8px",
                      borderRadius: "999px"
                    }}
                  >
                    {item.enabled ? "✓ 공유 중" : "✗ 비공유"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.description}</p>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "999px",
                  background: item.enabled ? "#241E1A" : "#D5CFC8",
                  flexShrink: 0,
                  position: "relative",
                  opacity: 0.7
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: item.enabled ? "19px" : "3px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "white"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 읽기 전용 안내 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "22px",
          padding: "14px 16px",
          border: "1px solid #E8DECF",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span style={{ fontSize: "16px", flexShrink: 0 }}>🔒</span>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
          공유 설정은 부모님 앱에서만 변경할 수 있어요. 자녀 쪽에서는 확인만 가능해요.
        </p>
      </div>
    </DetailScreen>
  );
}
