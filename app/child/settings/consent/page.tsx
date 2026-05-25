import { Lock, Shield } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { consentSharing } from "@/lib/mockData";

export default function ConsentPage() {
  return (
    <DetailScreen title="동의 관리" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 안내 배너 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "20px",
          display: "flex",
          gap: "12px"
        }}
      >
        <Shield size={20} style={{ color: "#E07856", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500 }}>
            {consentSharing.childNoticeTitle}
          </p>
          <p style={{ fontSize: "13px", color: "#5F4534", margin: 0, lineHeight: 1.5 }}>
            {consentSharing.childNoticeBody}
          </p>
        </div>
      </div>

      {/* 항목 리스트 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>공유 항목 (읽기 전용)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {consentSharing.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                background: "#FBF6F0",
                borderRadius: "14px"
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>{item.label}</p>
                  <span
                    style={{
                      fontSize: "12px",
                      color: item.enabled ? "#3A6B3A" : "#B07A5C",
                      fontWeight: 600
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
                  background: item.enabled ? "#7AB87A" : "#D9CEC6",
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
          background: "white",
          borderRadius: "14px",
          padding: "14px 16px",
          boxShadow: "0 2px 8px rgba(61,36,25,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <Lock size={16} style={{ color: "#B07A5C", flexShrink: 0 }} />
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
          공유 설정은 부모님 앱에서만 변경할 수 있어요. 자녀 쪽에서는 확인만 가능해요.
        </p>
      </div>
    </DetailScreen>
  );
}
