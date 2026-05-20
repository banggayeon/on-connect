"use client";

import { useEffect, useMemo, useState } from "react";

type ParentTemperature = {
  parentId: string;
  displayName: string;
  temperature: number;
  label: string;
  delta: number;
  reasons: string[];
};

type Briefing = {
  summary: string;
  recommendedMessage: string;
  evidence: string[];
  reasoning: string;
  createdAt: string;
};

type ParentBriefingCardProps = {
  userId: string;
  parentTemperatures: ParentTemperature[];
  fallbackBriefings: Record<string, Briefing>;
};

function getFallbackBriefing(parentId: string, fallbackBriefings: Record<string, Briefing>) {
  return fallbackBriefings[parentId] ?? Object.values(fallbackBriefings)[0];
}

function formatDelta(delta: number) {
  return delta > 0 ? `+${delta}°` : `${delta}°`;
}

export function ParentBriefingCard({ userId, parentTemperatures, fallbackBriefings }: ParentBriefingCardProps) {
  const [selectedParentId, setSelectedParentId] = useState(parentTemperatures[0]?.parentId ?? "");
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReasonOpen, setIsReasonOpen] = useState(false);

  const selectedParent = useMemo(() => {
    return parentTemperatures.find((parent) => parent.parentId === selectedParentId) ?? parentTemperatures[0];
  }, [parentTemperatures, selectedParentId]);

  useEffect(() => {
    let ignore = false;

    async function loadBriefing() {
      if (!selectedParent) return;

      setIsLoading(true);
      setIsReasonOpen(false);

      try {
        const response = await fetch("/api/ai/briefing", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            userId,
            parentId: selectedParent.parentId,
            currentSituation: "자녀 홈에서 오늘의 관계 온도와 Parent Briefing 확인"
          })
        });

        if (!response.ok) throw new Error("Briefing request failed");

        const data = (await response.json()) as Briefing;
        if (!ignore) setBriefing(data);
      } catch {
        if (!ignore) setBriefing(getFallbackBriefing(selectedParent.parentId, fallbackBriefings));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadBriefing();
    return () => { ignore = true; };
  }, [fallbackBriefings, selectedParent, userId]);

  if (!selectedParent) return null;

  const visibleBriefing = briefing ?? getFallbackBriefing(selectedParent.parentId, fallbackBriefings);
  const visibleEvidence = visibleBriefing.evidence.slice(0, 3);

  return (
    <section style={{ padding: "0 0 32px" }}>
      {/* 섹션 구분 */}
      <div style={{ height: "1px", background: "#F0E4D8", margin: "24px 0 20px" }} />
      <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>
        Today&apos;s Parent Briefing
      </p>

      {/* 부모 선택 탭 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {parentTemperatures.map((parent) => {
          const isSelected = parent.parentId === selectedParent.parentId;
          return (
            <button
              key={parent.parentId}
              type="button"
              onClick={() => setSelectedParentId(parent.parentId)}
              style={{
                border: isSelected ? "1.5px solid #FF8A65" : "1.5px solid #F0E4D8",
                background: isSelected ? "linear-gradient(135deg, #FFE5DA, #FFF8F0)" : "white",
                borderRadius: "16px",
                padding: "14px",
                textAlign: "left",
                boxShadow: isSelected ? "0 4px 12px rgba(224,120,86,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer",
                minWidth: 0
              }}
            >
              <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>
                {parent.displayName}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                <span style={{ fontSize: "26px", color: "#3D2419", fontWeight: 500, lineHeight: 1 }}>
                  {parent.temperature.toFixed(1)}°
                </span>
                <span style={{ fontSize: "12px", color: "#8A6B5C" }}>{parent.label}</span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: parent.delta >= 0 ? "#3A6B3A" : "#8A6B5C",
                  margin: "6px 0 0",
                  fontWeight: 600
                }}
              >
                {formatDelta(parent.delta)}
              </p>
            </button>
          );
        })}
      </div>

      {/* 브리핑 카드 */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 2px 12px rgba(61,36,25,0.06)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>오늘의 추천</p>
          <span
            style={{
              fontSize: "12px",
              color: "#3A6B3A",
              background: "#E8F3E5",
              padding: "4px 10px",
              borderRadius: "999px",
              fontWeight: 500
            }}
          >
            AI 추천
          </span>
        </div>

        {isLoading ? (
          <p style={{ fontSize: "16px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>
            따뜻한 신호를 찾고 있어요...
          </p>
        ) : (
          <>
            <p
              style={{
                fontSize: "18px",
                color: "#3D2419",
                margin: "0 0 12px",
                fontWeight: 500,
                lineHeight: 1.45
              }}
            >
              {visibleBriefing.summary}
            </p>

            <div
              style={{
                background: "#FFF1DA",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "12px"
              }}
            >
              <p style={{ fontSize: "12px", color: "#7A5A1A", margin: "0 0 6px", fontWeight: 500 }}>
                추천 대화 시작문
              </p>
              <p style={{ fontSize: "15px", color: "#5F4534", margin: 0, lineHeight: 1.55 }}>
                {visibleBriefing.recommendedMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsReasonOpen((v) => !v)}
              style={{
                width: "100%",
                border: "1px solid #F0E4D8",
                background: "#FBF6F0",
                borderRadius: "12px",
                padding: "12px",
                color: "#3D2419",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              왜 이렇게 추천했나요?
            </button>

            {isReasonOpen ? (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {visibleEvidence.map((item) => (
                  <div key={item} style={{ background: "#E8F3E5", borderRadius: "12px", padding: "12px" }}>
                    <p style={{ fontSize: "14px", color: "#1F4A1F", margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "4px 0 0", lineHeight: 1.5 }}>
                  {visibleBriefing.reasoning}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
