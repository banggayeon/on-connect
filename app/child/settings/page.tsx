"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Shield, User } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { childProfile } from "@/lib/mockData";

export default function ChildSettingsPage() {
  const router = useRouter();

  return (
    <ChildAppShell className="bg-gradient-to-b from-[#FBF6F0] via-cream-50 to-white">
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
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 2px", fontWeight: 600 }}>
                  {childProfile.name}
                </p>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>
                  자녀 · {childProfile.age}세
                </p>
              </div>
              <ChevronRight size={16} style={{ color: "#B07A5C" }} />
            </div>
          </button>
          <div
            style={{ height: "1px", background: "#F5EDE6", marginBottom: "12px" }}
          />
          <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px" }}>연결된 부모님</p>
          <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>엄마, 아빠 · 2명 연결됨</p>
        </div>

        {/* 설정 항목 리스트 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "6px 4px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          {[
            {
              icon: <Shield size={18} style={{ color: "#E07856" }} />,
              label: "동의 관리",
              desc: "부모님이 공유한 정보 확인",
              badge: "핵심",
              path: "/child/settings/consent"
            },
            {
              icon: <Bell size={18} style={{ color: "#E8A04E" }} />,
              label: "알림 설정",
              desc: "넛지 · 질문 · 안부 알림",
              badge: null,
              path: "/child/settings/notification"
            }
          ].map((item, i, arr) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.path)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: i < arr.length - 1 ? "1px solid #F5EDE6" : "none",
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
                  borderRadius: "12px",
                  background: "#FBF6F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, fontWeight: 500 }}>{item.label}</p>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#8A3E25",
                        background: "#FFE5DA",
                        borderRadius: "6px",
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
              <ChevronRight size={16} style={{ color: "#B07A5C" }} />
            </button>
          ))}
        </div>

        {/* 앱 정보 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "6px 4px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          {["개인정보 처리방침", "서비스 이용약관", "문의하기"].map((label, i, arr) => (
            <div
              key={label}
              style={{
                padding: "15px 14px",
                borderBottom: i < arr.length - 1 ? "1px solid #F5EDE6" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <p style={{ fontSize: "14px", color: "#3D2419", margin: 0 }}>{label}</p>
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
