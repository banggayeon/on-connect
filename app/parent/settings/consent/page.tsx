"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { childProfile, defaultConsent } from "@/lib/mockData";
import type { ConsentSettings } from "@/lib/mockData";

const CONSENT_ITEMS: { key: keyof ConsentSettings; label: string; desc: (childName: string) => string }[] = [
  { key: "healthShare",   label: "건강 기록",  desc: (childName) => `체크인한 건강 상태를 ${childName}이가 볼 수 있어요` },
  { key: "moodShare",     label: "기분 기록",  desc: (childName) => `체크인한 기분 상태를 ${childName}이가 볼 수 있어요` },
  { key: "memoShare",     label: "생활 메모",  desc: (childName) => `기록한 메모를 ${childName}이가 볼 수 있어요` },
  { key: "activityShare", label: "활동 기록",  desc: (childName) => `활동 기록을 ${childName}이가 볼 수 있어요` },
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
      // OFF로 변경 시 확인 모달
      setPendingKey(key);
    } else {
      // ON으로 변경은 즉시
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
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#3D2419" }}
        >
          <ChevronLeft style={{ width: "var(--parent-icon-size)", height: "var(--parent-icon-size)" }} />
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title)", color: "#3D2419", margin: 0, fontWeight: 600 }}>
          정보 공유 설정
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-base)", color: "#6B4C3B", margin: "0 0 24px", lineHeight: 1.6 }}>
        {childProfile.name}이와 공유할 정보를 선택해주세요.<br />
        공유하지 않은 정보는 {childProfile.name}이가 볼 수 없어요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {CONSENT_ITEMS.map(({ key, label, desc }) => {
          const isOn = consent[key];
          return (
            <div
              key={key}
              style={{
                background: "white", borderRadius: "20px", padding: "20px",
                boxShadow: "0 2px 12px rgba(61,36,25,0.06)",
                display: "flex", alignItems: "center", gap: "14px",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", margin: "0 0 4px", fontWeight: 600 }}>
                  {label}
                </p>
                <p style={{ fontSize: "var(--parent-font-caption)", color: isOn ? "#2A6B2A" : "#9E9E9E", margin: 0 }}>
                  {isOn ? desc(childProfile.name) : "나만 볼 수 있어요"}
                </p>
              </div>
              {/* 토글 */}
              <button
                type="button"
                onClick={() => handleToggle(key)}
                aria-pressed={isOn}
                style={{
                  width: "56px", height: "32px", borderRadius: "16px",
                  background: isOn ? "#4CAF50" : "#D0D0D0",
                  border: "none", cursor: "pointer", position: "relative",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute", top: "4px",
                    left: isOn ? "28px" : "4px",
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
          <div style={{ background: "white", borderRadius: "24px", padding: "32px 24px", width: "100%", maxWidth: "380px" }}>
            <p style={{ fontSize: "var(--parent-font-base)", color: "#3D2419", textAlign: "center", margin: "0 0 12px", fontWeight: 600 }}>
              정말 공유를 중단할까요?
            </p>
            <p style={{ fontSize: "var(--parent-font-caption)", color: "#6B4C3B", textAlign: "center", margin: "0 0 28px", lineHeight: 1.6 }}>
              {childProfile.name}이가 이 정보를<br />더 이상 볼 수 없어요.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setPendingKey(null)}
                style={{
                  flex: 1, minHeight: "var(--parent-btn-height)", background: "#F5F0EC",
                  border: "none", borderRadius: "14px", fontSize: "var(--parent-font-base)",
                  color: "#3D2419", fontWeight: 500, cursor: "pointer",
                }}
              >
                아니요
              </button>
              <button
                type="button"
                onClick={confirmOff}
                style={{
                  flex: 1, minHeight: "var(--parent-btn-height)",
                  background: "linear-gradient(135deg, #FF8A65, #E07856)",
                  border: "none", borderRadius: "14px", fontSize: "var(--parent-font-base)",
                  color: "white", fontWeight: 600, cursor: "pointer",
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
