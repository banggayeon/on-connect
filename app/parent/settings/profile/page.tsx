"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile } from "@/lib/mockData";

const CONTACT_TIME_OPTIONS = ["오전", "오후", "저녁", "상관없음"];

export default function ParentProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("어머니");
  const [preferTime, setPreferTime] = useState("저녁");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          내 프로필
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
        {/* 이름 */}
        <div>
          <label style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", fontWeight: 500, display: "block", marginBottom: "8px" }}>
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%", fontSize: "var(--parent-font-base)", color: "#3D2419",
              border: "1px solid #FFCBB0", borderRadius: "14px", padding: "14px 16px",
              outline: "none", boxSizing: "border-box", fontFamily: "inherit",
              background: "white",
            }}
          />
        </div>

        {/* 연결된 자녀 (표시만) */}
        <div>
          <label style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", fontWeight: 500, display: "block", marginBottom: "8px" }}>
            연결된 자녀
          </label>
          <div
            style={{
              background: "#F5F0EC", borderRadius: "14px", padding: "14px 16px",
              fontSize: "var(--parent-font-base)", color: "#6B4C3B",
            }}
          >
            {childProfile.name} (아들)
          </div>
        </div>

        {/* 선호 연락 시간대 */}
        <div>
          <label style={{ fontSize: "var(--parent-font-caption)", color: "#B07A5C", fontWeight: 500, display: "block", marginBottom: "8px" }}>
            선호 연락 시간대
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {CONTACT_TIME_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPreferTime(opt)}
                style={{
                  flex: "1 1 auto", minHeight: "var(--parent-btn-height)",
                  background: preferTime === opt ? "#FFEDE0" : "white",
                  border: preferTime === opt ? "2px solid #FF8A65" : "1px solid #FFE4CC",
                  borderRadius: "14px", fontSize: "var(--parent-font-base)",
                  color: preferTime === opt ? "#E07856" : "#3D2419",
                  fontWeight: preferTime === opt ? 600 : 400, cursor: "pointer",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      {saved ? (
        <div style={{ textAlign: "center", padding: "16px", background: "#E8F3E5", borderRadius: "16px" }}>
          <p style={{ fontSize: "var(--parent-font-base)", color: "#2A6B2A", margin: 0, fontWeight: 600 }}>
            저장했어요! ✓
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          style={{
            width: "100%", minHeight: "var(--parent-btn-height)",
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
            color: "white", border: "none", borderRadius: "16px",
            fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
          }}
        >
          저장하기
        </button>
      )}
    </ParentAppShell>
  );
}
