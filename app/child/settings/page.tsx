"use client";

import { useRouter } from "next/navigation";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { childProfile } from "@/lib/mockData";

const SETTINGS_ITEMS = [
  {
    emoji: "🛡",
    label: "동의 관리",
    desc: "부모님이 공유한 정보 확인",
    badge: "핵심",
    path: "/child/settings/consent"
  },
  {
    emoji: "🔔",
    label: "알림 설정",
    desc: "넛지 · 질문 · 안부 알림",
    badge: null,
    path: "/child/settings/notification"
  }
];

export default function ChildSettingsPage() {
  const router = useRouter();

  return (
    <ChildAppShell>
      <header style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>
          계정 및 앱 설정
        </p>
        <h1 style={{ fontSize: "26px", color: "#241E1A", margin: 0, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
          설정
        </h1>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 내 프로필 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 14px", fontWeight: 500 }}>내 프로필</p>
          <button
            type="button"
            onClick={() => router.push("/child/settings/profile")}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "999px",
                  background: "#F1D6CC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "22px"
                }}
              >
                👤
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 2px", fontWeight: 600 }}>
                  {childProfile.name}
                </p>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>
                  자녀 · {childProfile.age}세
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          <div style={{ height: "1px", background: "#F0E7D7", marginBottom: "12px" }} />
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 4px" }}>연결된 부모님</p>
          <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, fontWeight: 500 }}>엄마, 아빠 · 2명 연결됨</p>
        </div>

        {/* 설정 항목 리스트 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "6px 4px",
            border: "1px solid #E8DECF"
          }}
        >
          {SETTINGS_ITEMS.map((item, i, arr) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.path)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: i < arr.length - 1 ? "1px solid #F0E7D7" : "none",
                padding: "16px 14px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "14px",
                  background: "#F0E7D7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "18px"
                }}
              >
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{item.label}</p>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#241E1A",
                        background: "#D8E0A6",
                        borderRadius: "999px",
                        padding: "2px 7px",
                        fontWeight: 600
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        {/* 앱 정보 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "6px 4px",
            border: "1px solid #E8DECF"
          }}
        >
          {["개인정보 처리방침", "서비스 이용약관", "문의하기"].map((label, i, arr) => (
            <div
              key={label}
              style={{
                padding: "15px 14px",
                borderBottom: i < arr.length - 1 ? "1px solid #F0E7D7" : "none"
              }}
            >
              <p style={{ fontSize: "14px", color: "#3D332C", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9A8B7D", margin: "4px 0 8px" }}>
          온커넥트 v1.0.0
        </p>
      </div>
    </ChildAppShell>
  );
}
