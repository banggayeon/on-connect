"use client";

import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { useFontSize } from "@/contexts/FontSizeContext";

const SETTINGS_ITEMS = [
  { icon: "📝", label: "내 프로필",       desc: "이름, 연결 자녀, 선호 시간대",    path: "/parent/settings/profile" },
  { icon: "🔤", label: "글씨 크기",       desc: "읽기 편한 크기로 조절해보세요",   path: "/parent/settings/font-size" },
  { icon: "🔒", label: "정보 공유 설정",   desc: "자녀와 공유할 정보를 선택하세요",  path: "/parent/settings/consent" },
];

export default function ParentSettingsPage() {
  const router = useRouter();
  const { config } = useFontSize();

  return (
    <ParentAppShell>
      <h1 style={{ fontSize: "var(--parent-font-title)", color: "#241E1A", margin: "0 0 24px", fontWeight: 700, letterSpacing: "-0.03em" }}>
        설정
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {SETTINGS_ITEMS.map(({ icon, label, desc, path }) => (
          <button
            key={path}
            type="button"
            onClick={() => router.push(path)}
            style={{
              width: "100%", textAlign: "left", background: "#FFFBF2", borderRadius: "26px",
              padding: "20px", minHeight: "var(--parent-btn-height)",
              border: "1px solid #E8DECF", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "14px",
            }}
          >
            <span style={{ fontSize: "26px" }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 2px", fontWeight: 600 }}>
                {label}
              </p>
              <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: 0 }}>
                {desc}
              </p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18L15 12L9 6" stroke="#8A6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}

        <div
          style={{
            background: "#FFFBF2", borderRadius: "26px", padding: "20px",
            border: "1px solid #E8DECF", display: "flex", alignItems: "center", gap: "14px",
          }}
        >
          <span style={{ fontSize: "26px" }}>ℹ️</span>
          <div>
            <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 2px", fontWeight: 600 }}>
              앱 정보
            </p>
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", margin: 0 }}>
              온커넥트 v1.0.0 · 현재 글씨: {config.label}
            </p>
          </div>
        </div>
      </div>
    </ParentAppShell>
  );
}
