"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { GreetingModal } from "@/components/child/GreetingModal";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import { demoDataset, mockDailyQuestions } from "@/lib/mockData";

const PARENT_META: Record<string, { char: string; tone: string; label: string }> = {
  parent_mother: { char: "엄", tone: "#F1D6CC", label: "엄마" },
  parent_father: { char: "아", tone: "#F1E5C8", label: "아빠" },
};

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ChildMenuPage() {
  const router = useRouter();
  const { selectedParentId } = useSelectedParent();
  const [modalTopic, setModalTopic] = useState<string | null>(null);

  const meta = PARENT_META[selectedParentId] ?? PARENT_META["parent_mother"];
  const result = calculateRelationshipTemperature(selectedParentId, demoDataset, demoDataset.generatedAt);
  const todayQuestion = mockDailyQuestions[0];
  const questionAnswered = !!todayQuestion.childAnswer;

  const menuItems = [
    {
      key: "question",
      accent: "#F1E5C8",
      icon: "💬",
      title: "오늘의 질문",
      desc: questionAnswered ? "내 답변 보기 · 부모님 답변 확인" : "아직 답변하지 않은 질문이 있어요",
      badge: questionAnswered ? null : "미답변",
      onClick: () => router.push("/child/home/question"),
    },
    {
      key: "greeting",
      accent: "#CDDCC8",
      icon: "✉️",
      title: "안부 추천받기",
      desc: `${meta.label}에게 보낼 안부를 AI가 만들어드려요`,
      badge: null,
      onClick: () => setModalTopic("요즘"),
    },
    {
      key: "temperature",
      accent: "#D9D0E5",
      icon: "📊",
      title: "관계 기록 자세히 보기",
      desc: `현재 온기 ${result.temperature.toFixed(1)}° · ${result.label}`,
      badge: null,
      onClick: () => router.push("/child/home/menu/temperature"),
    },
  ];

  return (
    <DetailScreen title={meta.label}>
      {/* ── 부모 아바타 + 온기 요약 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: meta.tone, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", fontWeight: 800, color: "#241E1A", letterSpacing: "-0.02em",
        }}>
          {meta.char}
        </div>
        <div>
          <div style={{ fontSize: "19px", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.02em" }}>
            {meta.label}
          </div>
          <div style={{ fontSize: "13px", color: "#8A6B5C", marginTop: 3, letterSpacing: "-0.005em" }}>
            온기 {result.temperature.toFixed(1)}° · {result.label}
          </div>
        </div>
      </div>

      {/* ── 메뉴 항목 ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {menuItems.map((item, idx) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 0",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderBottom: idx < menuItems.length - 1 ? "1px solid #F0E7D7" : "none",
            }}
          >
            {/* 왼쪽 색상 아이콘 영역 */}
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: item.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
            }}>
              {item.icon}
            </div>

            {/* 텍스트 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#241E1A", letterSpacing: "-0.015em" }}>
                  {item.title}
                </span>
                {item.badge && (
                  <span style={{
                    fontSize: "10.5px", fontWeight: 700, color: "#6E4A39",
                    background: "#F6D6BD", borderRadius: 999, padding: "2px 8px",
                    letterSpacing: "-0.005em",
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12.5px", color: "#8A6B5C", letterSpacing: "-0.005em", lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>

            <ChevronRight />
          </button>
        ))}
      </div>

      {/* GreetingModal */}
      <GreetingModal
        topic={modalTopic}
        parentId={selectedParentId}
        onClose={() => setModalTopic(null)}
      />
    </DetailScreen>
  );
}
