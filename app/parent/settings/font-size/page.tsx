"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          글씨 크기
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-base)", color: "#B07A5C", margin: "0 0 24px" }}>
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
                width: "100%", textAlign: "left", background: "white",
                borderRadius: "20px", padding: "20px",
                border: isSelected ? "2px solid #FF8A65" : "2px solid transparent",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(224,120,86,0.18)"
                  : "0 2px 12px rgba(61,36,25,0.06)",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
              }}
            >
              <div
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  border: isSelected ? "6px solid #FF8A65" : "2px solid #FFCBB0",
                  background: "white",
                }}
              />
              <div>
                <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 6px", fontWeight: 600 }}>
                  {cfg.label}{level === "md" ? " (기본)" : ""}
                </p>
                <p style={{ fontSize: `${cfg.baseSize}px`, color: "#6B4C3B", margin: 0, lineHeight: 1.4 }}>
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
          background: "white", borderTop: "1px solid #FFE4CC",
        }}
      >
        {toast && (
          <p style={{ fontSize: "var(--parent-font-caption)", color: "#FF8A65", textAlign: "center", margin: "0 0 8px", fontWeight: 500 }}>
            글씨 크기가 변경됐어요! ✓
          </p>
        )}
        <button
          type="button"
          onClick={handleApply}
          style={{
            width: "100%", minHeight: "var(--parent-btn-height)",
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
            color: "white", border: "none", borderRadius: "16px",
            fontSize: "var(--parent-font-base)", fontWeight: 600, cursor: "pointer",
          }}
        >
          이 크기로 설정하기
        </button>
      </div>
    </ParentAppShell>
  );
}
