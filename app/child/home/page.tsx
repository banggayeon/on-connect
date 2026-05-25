"use client";

import { useState } from "react";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { ParentBriefingCard } from "@/components/child/ParentBriefingCard";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { RelationshipTemperatureGrid } from "@/components/child/RelationshipTemperatureGrid";
import { careBriefing, childProfile, contactStats, demoDataset, fatherParentBriefing, recentSignals } from "@/lib/mockData";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";

const SIGNAL_COLORS: Record<string, { bg: string; dot: string }> = {
  coral: { bg: "#FFE5DA", dot: "#E07856" },
  honey: { bg: "#FFF1DA", dot: "#E8A04E" },
  leaf: { bg: "#E8F3E5", dot: "#7AB87A" },
  sky: { bg: "#E0EDF5", dot: "#7DA8C8" }
};

const STAT_COLORS: Record<string, { bg: string; icon: string; label: string; value: string }> = {
  leaf: { bg: "#E8F3E5", icon: "#7AB87A", label: "#3A6B3A", value: "#1F4A1F" },
  sky: { bg: "#E0EDF5", icon: "#7DA8C8", label: "#2C5A7A", value: "#1A3A55" },
  honey: { bg: "#FFF1DA", icon: "#E8A04E", label: "#7A5A1A", value: "#5F4534" }
};

const allParentTemperatures = demoDataset.parents.map((parent) => {
  const result = calculateRelationshipTemperature(parent.id, demoDataset, demoDataset.generatedAt);
  return {
    parentId: parent.id,
    displayName: parent.displayName,
    temperature: result.temperature,
    label: result.label,
    delta: result.delta,
    reasons: result.reasons
  };
});

const fallbackBriefings = Object.fromEntries(
  demoDataset.parents.map((parent) => [
    parent.id,
    {
      summary: parent.agentSeedSummary.parentBriefing.title,
      recommendedMessage: parent.agentSeedSummary.parentBriefing.recommendedAction,
      evidence: [
        parent.agentSeedSummary.parentBriefing.summary,
        parent.careSignals[0].evidence,
        parent.preferenceProfile.preferredContactWindows[0].reason
      ],
      reasoning: parent.agentSeedSummary.relationshipTemperature.rationale,
      createdAt: `${demoDataset.generatedAt}T12:00:00+09:00`
    }
  ])
);

const perParentBriefing: Record<string, { title: string; headline: string; body: string }> = {
  [demoDataset.parents[0].id]: { title: "AI 브리핑", headline: careBriefing.headline, body: careBriefing.body },
  [demoDataset.parents[1].id]: { title: "AI 브리핑", headline: fatherParentBriefing.title, body: fatherParentBriefing.summary }
};

export default function ChildHomePage() {
  const [selectedParentId, setSelectedParentId] = useState(demoDataset.parents[0].id);

  const filteredTemperatures = allParentTemperatures.filter((t) => t.parentId === selectedParentId);
  const filteredStats = contactStats.filter((s) =>
    selectedParentId === demoDataset.parents[0].id ? s.id === "mother_greeting" : s.id === "father_photo"
  );
  const filteredSignals = recentSignals.filter((s) => s.senderId === selectedParentId);
  const activeBriefing = perParentBriefing[selectedParentId] ?? perParentBriefing[demoDataset.parents[0].id];

  return (
    <ChildAppShell>
      {/* Header */}
      <header style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>오늘의 온도</p>
        <h1 style={{ fontSize: "24px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
          안녕하세요, {childProfile.name}님 ☀
        </h1>
      </header>

      {/* Parent Tab Selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {demoDataset.parents.map((parent) => {
          const isActive = parent.id === selectedParentId;
          const isMomTab = parent.id === demoDataset.parents[0].id;
          return (
            <button
              key={parent.id}
              type="button"
              onClick={() => setSelectedParentId(parent.id)}
              style={{
                background: isActive
                  ? isMomTab
                    ? "linear-gradient(135deg, #FF8A65, #E07856)"
                    : "linear-gradient(135deg, #E8A04E, #D4883A)"
                  : "white",
                color: isActive ? "white" : "#8A6B5C",
                border: isActive ? "none" : "1.5px solid #F0E4D8",
                borderRadius: "999px",
                padding: "10px 24px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: isActive
                  ? isMomTab
                    ? "0 4px 12px rgba(224,120,86,0.25)"
                    : "0 4px 12px rgba(232,160,78,0.25)"
                  : "none"
              }}
            >
              {parent.displayName}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Temperature card (selected parent) */}
        <RelationshipTemperatureGrid temperatures={filteredTemperatures} />

        {/* Contact stat */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
          {filteredStats.map((stat) => {
            const colors = STAT_COLORS[stat.tone] ?? STAT_COLORS.leaf;
            return (
              <div
                key={stat.id}
                style={{
                  background: colors.bg,
                  borderRadius: "16px",
                  padding: "14px"
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: colors.icon,
                    marginBottom: "8px"
                  }}
                />
                <p style={{ fontSize: "12px", color: colors.label, margin: "0 0 3px" }}>{stat.label}</p>
                <p style={{ fontSize: "15px", color: colors.value, margin: 0, fontWeight: 600 }}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* 넛지 알림 카드 */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
            borderRadius: "18px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Bell size={18} style={{ color: "#E07856" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 2px", fontWeight: 500 }}>안부 알림</p>
            <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              {selectedParentId === demoDataset.parents[0].id
                ? "어머니께 마지막 연락한 지 4일째예요"
                : "아버지께 마지막 연락한 지 2일째예요"}
            </p>
          </div>
          <ChevronRight size={16} style={{ color: "#B07A5C", flexShrink: 0 }} />
        </div>

        {/* 오늘의 질문 미리보기 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            cursor: "pointer"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>오늘의 질문</p>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#7AB87A", fontWeight: 600 }}>
              <Sparkles size={12} /> AI
            </span>
          </div>
          <p style={{ fontSize: "16px", color: "#3D2419", margin: "0 0 10px", fontWeight: 500, lineHeight: 1.4 }}>
            어릴 때 가장 기억에 남는 가족 여행이 있으신가요?
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FBF6F0",
              borderRadius: "12px",
              padding: "10px 14px"
            }}
          >
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>답변하러 가기</p>
            <ChevronRight size={14} style={{ color: "#B07A5C" }} />
          </div>
        </div>

        {/* AI 브리핑 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>{activeBriefing.title}</p>
          <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500, lineHeight: 1.4 }}>
            {activeBriefing.headline}
          </p>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>{activeBriefing.body}</p>
        </div>

        {/* Recent signals (selected parent) */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>최근 시그널</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredSignals.map((signal) => {
              const colors = SIGNAL_COLORS[signal.tone] ?? SIGNAL_COLORS.coral;
              return (
                <div key={signal.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: colors.bg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: colors.dot
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", color: "#3D2419", margin: "0 0 2px", fontWeight: 600 }}>
                      {signal.senderName}
                    </p>
                    <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      &ldquo;{signal.summary}&rdquo;
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#B07A5C", flexShrink: 0 }}>{signal.createdAtText}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ParentBriefingCard
        userId={demoDataset.child.id}
        parentTemperatures={filteredTemperatures}
        fallbackBriefings={fallbackBriefings}
      />
    </ChildAppShell>
  );
}
