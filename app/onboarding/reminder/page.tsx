"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

const OPTIONS = [
  { value: "morning", label: "아침 · 8시", description: '"오늘 연락해볼 사람이 있어요"' },
  { value: "evening", label: "저녁 · 8시", description: '"오늘 챙긴 사람이 있나요?"' },
  { value: "weekend", label: "주말마다", description: '"주말에 가볍게 안부 한번?"' },
];

export default function ReminderPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(value: string) {
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  function goNext() {
    if (selected.length === 0) return;
    localStorage.setItem("reminderTimes", JSON.stringify(selected));
    router.push("/onboarding/accessibility");
  }

  return (
    <AppScreen>
      <div style={{ background: "#F6EDDB", minHeight: "100vh", padding: "30px 26px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>단계 2/3 · 알림</p>
        <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
          언제 알려드릴까요?
        </h1>
        <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 24px", lineHeight: 1.5 }}>
          여러 개 선택할 수 있어요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {OPTIONS.map(opt => {
            const on = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                style={{
                  background: on ? "#F1E5C8" : "#FFFBF2",
                  border: on ? "2px solid #6E4A39" : "1px solid #E8DECF",
                  borderRadius: "18px",
                  padding: on ? "15px 17px" : "16px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 3px", fontWeight: 500 }}>{opt.label}</p>
                  <p style={{ fontSize: "13px", color: on ? "#6E4A39" : "#8A6B5C", margin: 0 }}>{opt.description}</p>
                </div>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "6px",
                  background: on ? "#F1E5C8" : "transparent",
                  border: on ? "2px solid #6E4A39" : "1.5px solid #E8DECF",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {on && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="#6E4A39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "14px" }}>
          <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
            의무가 아니에요. 잊지 않게 살짝 떠올려드릴 뿐이에요.
          </p>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={goNext}
            disabled={selected.length === 0}
            style={{
              width: "100%",
              background: selected.length > 0 ? "#241E1A" : "#D5CFC8",
              color: selected.length > 0 ? "#FBF6EC" : "#9A8B7D",
              border: "none", borderRadius: "999px",
              padding: "17px 22px", fontSize: "16px", fontWeight: 500,
              cursor: selected.length > 0 ? "pointer" : "default",
            }}
          >
            다음
          </button>
          <button
            type="button"
            onClick={() => router.push("/onboarding/accessibility")}
            style={{ background: "none", border: "none", fontSize: "14px", color: "#8A6B5C", cursor: "pointer", padding: "4px" }}
          >
            알림 없이 시작할게요
          </button>
        </div>
      </div>
    </AppScreen>
  );
}
