import { Bell, ChevronRight, Lock, Shield, User } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { childProfile, consentSharing } from "@/lib/mockData";

export default function ChildSettingsPage() {
  return (
    <ChildAppShell className="bg-gradient-to-b from-[#FBF6F0] via-cream-50 to-white">
      {/* Header */}
      <header style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>
          계정 및 앱 설정
        </p>
        <h1 style={{ fontSize: "24px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
          설정
        </h1>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 내 프로필 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>내 프로필</p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8A65, #E07856)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <User size={22} style={{ color: "white" }} />
            </div>
            <div>
              <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 2px", fontWeight: 600 }}>
                {childProfile.name}
              </p>
              <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>
                자녀 · {childProfile.age}세
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FBF6F0",
              borderRadius: "12px",
              padding: "12px 14px",
              cursor: "pointer"
            }}
          >
            <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>프로필 수정</p>
            <ChevronRight size={16} style={{ color: "#B07A5C" }} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 2px",
              borderBottom: "1px solid #F5EDE6",
              cursor: "pointer"
            }}
          >
            <div>
              <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>연결된 부모님</p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>엄마, 아빠 · 2명 연결됨</p>
            </div>
            <ChevronRight size={16} style={{ color: "#B07A5C" }} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 2px",
              cursor: "pointer"
            }}
          >
            <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>관계 설정 변경</p>
            <ChevronRight size={16} style={{ color: "#B07A5C" }} />
          </div>
        </div>

        {/* 동의 관리 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Shield size={14} style={{ color: "#E07856" }} />
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>동의 관리</p>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#8A3E25",
                background: "#FFE5DA",
                borderRadius: "6px",
                padding: "2px 7px"
              }}
            >
              핵심
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.5 }}>
            {consentSharing.childNoticeBody}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {consentSharing.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#FBF6F0",
                  borderRadius: "12px",
                  padding: "12px 14px"
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "11px", color: "#8A6B5C", margin: 0 }}>{item.description}</p>
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "999px",
                    background: item.enabled ? "#7AB87A" : "#D9CEC6",
                    flexShrink: 0,
                    marginLeft: "12px",
                    position: "relative"
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
                      background: "white",
                      transition: "left 0.2s"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "12px",
              padding: "10px 14px",
              background: "#FBF6F0",
              borderRadius: "12px"
            }}
          >
            <Lock size={14} style={{ color: "#B07A5C", flexShrink: 0 }} />
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
              동의 항목은 부모님 앱에서만 변경할 수 있어요
            </p>
          </div>
        </div>

        {/* 알림 설정 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Bell size={14} style={{ color: "#B07A5C" }} />
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>알림 설정</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "넛지 알림", desc: "마지막 연락 후 안부 리마인더", enabled: true, detail: "매일" },
              { label: "오늘의 질문 알림", desc: "새 질문이 도착하면 알림", enabled: true, detail: "오후 7시" },
              { label: "부모님 안부 수신", desc: "부모님이 안부를 남기면 알림", enabled: true, detail: "즉시" }
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "13px 2px",
                  borderBottom: i < arr.length - 1 ? "1px solid #F5EDE6" : "none"
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.desc}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#B07A5C" }}>{item.detail}</span>
                  <div
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "999px",
                      background: item.enabled ? "#E07856" : "#D9CEC6",
                      flexShrink: 0,
                      position: "relative"
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
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
              background: "#FBF6F0",
              borderRadius: "12px",
              padding: "12px 14px",
              cursor: "pointer"
            }}
          >
            <p style={{ fontSize: "13px", color: "#3D2419", margin: 0, fontWeight: 500 }}>알림 상세 설정</p>
            <ChevronRight size={14} style={{ color: "#B07A5C" }} />
          </div>
        </div>

        {/* 앱 정보 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>앱 정보</p>
          {[
            { label: "개인정보 처리방침" },
            { label: "서비스 이용약관" },
            { label: "문의하기" }
          ].map((item, i, arr) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 2px",
                borderBottom: i < arr.length - 1 ? "1px solid #F5EDE6" : "none",
                cursor: "pointer"
              }}
            >
              <p style={{ fontSize: "14px", color: "#3D2419", margin: 0 }}>{item.label}</p>
              <ChevronRight size={16} style={{ color: "#B07A5C" }} />
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#C5A898", margin: "4px 0 8px" }}>
          온커넥트 v1.0.0
        </p>
      </div>
    </ChildAppShell>
  );
}
