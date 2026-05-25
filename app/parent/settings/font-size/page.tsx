"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { useFontSize, FONT_SIZE_CONFIGS } from "@/contexts/FontSizeContext";
import type { FontSizeLevel } from "@/contexts/FontSizeContext";

const LEVELS: FontSizeLevel[] = ["xs", "sm", "md", "lg", "xl"];

export default function FontSizeSettingPage() {
  const router = useRouter();
  const { fontSizeLevel, setFontSizeLevel } = useFontSize();
  const [preview, setPreview] = useState<FontSizeLevel>(fontSizeLevel);
  const [toast, setToast] = useState(false);

  function handleApply() {
    setFontSizeLevel(preview);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#241E1A", margin: 0, fontWeight: 600 }}>
          글씨 크기
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-base)", color: "#8A6B5C", margin: "0 0 24px" }}>
        편한 글씨 크기를 선택해주세요
      </p>

      {/* 5단계 선택 카드 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "100px" }}>
        {LEVELS.map((level) => {
          const cfg = FONT_SIZE_CONFIGS[level];
          const isSelected = preview === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setPreview(level)}
              style={{
                width: "100%", textAlign: "left",
                background: isSelected ? "#241E1A" : "#FFFBF2",
                borderRadius: "26px", padding: "20px",
                border: isSelected ? "none" : "1px solid #E8DECF",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
              }}
            >
              <div
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  border: isSelected ? "6px solid #FBF6EC" : "2px solid #E8DECF",
                  background: isSelected ? "#241E1A" : "#FFFBF2",
                }}
              />
              <div>
                <p style={{ fontSize: "var(--parent-font-base)", color: isSelected ? "#FBF6EC" : "#241E1A", margin: "0 0 6px", fontWeight: 600 }}>
                  {cfg.label}{level === "md" ? " (기본)" : ""}
                </p>
                <p style={{ fontSize: `${cfg.baseSize}px`, color: isSelected ? "#FBF6EC" : "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
                  안녕하세요, 좋은 하루 보내세요.
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 적용 버튼 (하단 고정) */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: "430px", padding: "16px 22px 28px",
          background: "#FAF6EE", borderTop: "1px solid #F0E7D7",
        }}
      >
        {toast && (
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", textAlign: "center", margin: "0 0 8px", fontWeight: 500 }}>
            글씨 크기가 변경됐어요! ✓
          </p>
        )}
        <button
          type="button"
          onClick={handleApply}
          style={{
            width: "100%", minHeight: "var(--parent-btn-height)",
            background: "#241E1A",
            color: "#FBF6EC", border: "none", borderRadius: "999px",
            fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
          }}
        >
          이 크기로 설정하기
        </button>
      </div>
    </ParentAppShell>
  );
}
