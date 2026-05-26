"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, defaultConsent } from "@/lib/mockData";
import type { ConsentSettings } from "@/lib/mockData";

const CONSENT_ITEMS: { key: keyof ConsentSettings; label: string; desc: (childName: string) => string; aiNote: string }[] = [
  {
    key: "healthShare",   label: "건강 기록",
    desc: (childName) => `체크인한 건강 상태를 ${childName}이가 볼 수 있어요`,
    aiNote: "건강 상태는 안부 추천 타이밍에 참고돼요",
  },
  {
    key: "moodShare",     label: "기분 기록",
    desc: (childName) => `체크인한 기분 상태를 ${childName}이가 볼 수 있어요`,
    aiNote: "기분 기록은 대화 전 브리핑에 참고될 수 있어요",
  },
  {
    key: "memoShare",     label: "생활 메모",
    desc: (childName) => `기록한 메모를 ${childName}이가 볼 수 있어요`,
    aiNote: "메모 내용은 관계 리포트 주제 분석에 활용돼요",
  },
  {
    key: "activityShare", label: "활동 기록",
    desc: (childName) => `활동 기록을 ${childName}이가 볼 수 있어요`,
    aiNote: "활동 흐름은 안부 추천 주제 선정에 참고돼요",
  },
];

export default function ConsentSettingPage() {
  const router = useRouter();
  const [consent, setConsent] = useState<ConsentSettings>(defaultConsent);
  const [pendingKey, setPendingKey] = useState<keyof ConsentSettings | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("parentConsent");
      if (saved) setConsent(JSON.parse(saved));
    } catch {}
  }, []);

  function saveConsent(next: ConsentSettings) {
    setConsent(next);
    localStorage.setItem("parentConsent", JSON.stringify(next));
  }

  function handleToggle(key: keyof ConsentSettings) {
    if (consent[key]) {
      setPendingKey(key);
    } else {
      saveConsent({ ...consent, [key]: true });
    }
  }

  function confirmOff() {
    if (!pendingKey) return;
    saveConsent({ ...consent, [pendingKey]: false });
    setPendingKey(null);
  }

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
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
          정보 공유 설정
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-base)", color: "#8A6B5C", margin: "0 0 24px", lineHeight: 1.6 }}>
        {childProfile.name}이와 공유할 정보를 선택해주세요.<br />
        공유하지 않은 정보는 {childProfile.name}이가 볼 수 없어요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {CONSENT_ITEMS.map(({ key, label, desc, aiNote }) => {
          const isOn = consent[key];
          return (
            <div
              key={key}
              style={{
                background: "#FFFBF2", borderRadius: "26px", padding: "20px",
                border: "1px solid #E8DECF",
                display: "flex", alignItems: "center", gap: "14px",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>
                  {label}
                </p>
                <p style={{ fontSize: "var(--parent-font-caption)", color: isOn ? "#3D332C" : "#9A8B7D", margin: "0 0 6px" }}>
                  {isOn ? desc(childProfile.name) : "나만 볼 수 있어요"}
                </p>
                {isOn && (
                  <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
                    이 정보는 AI 추천에 사용될 수 있어요 · {aiNote}
                  </p>
                )}
              </div>
              {/* 토글 */}
              <button
                type="button"
                onClick={() => handleToggle(key)}
                aria-pressed={isOn}
                style={{
                  width: "44px", height: "24px", borderRadius: "999px",
                  background: isOn ? "#241E1A" : "#D5CFC8",
                  border: "none", cursor: "pointer", position: "relative",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute", top: "3px",
                    left: isOn ? "23px" : "3px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* 확인 모달 */}
      {pendingKey && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "22px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setPendingKey(null); }}
        >
          <div style={{ background: "#FFFBF2", borderRadius: "26px", padding: "32px 24px", width: "100%", maxWidth: "380px", border: "1px solid #E8DECF" }}>
            <p style={{ fontSize: "var(--parent-font-base)", color: "#241E1A", textAlign: "center", margin: "0 0 12px", fontWeight: 600 }}>
              정말 공유를 중단할까요?
            </p>
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#8A6B5C", textAlign: "center", margin: "0 0 28px", lineHeight: 1.6 }}>
              {childProfile.name}이가 이 정보를<br />더 이상 볼 수 없어요.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setPendingKey(null)}
                style={{
                  flex: 1, minHeight: "var(--parent-btn-height)", background: "#F0E7D7",
                  border: "none", borderRadius: "999px", fontSize: "var(--parent-font-base)",
                  color: "#241E1A", fontWeight: 500, cursor: "pointer",
                }}
              >
                아니요
              </button>
              <button
                type="button"
                onClick={confirmOff}
                style={{
                  flex: 1, minHeight: "var(--parent-btn-height)",
                  background: "#241E1A",
                  border: "none", borderRadius: "999px", fontSize: "var(--parent-font-base)",
                  color: "#FBF6EC", fontWeight: 600, cursor: "pointer",
                }}
              >
                네, 중단할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </ParentAppShell>
  );
}
