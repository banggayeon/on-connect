"use client";

import { useState } from "react";
import { Activity, ChevronRight, HeartPulse, Moon, Sparkles } from "lucide-react";
import { CareActionCard, type CareActionItem } from "@/components/child/CareActionCard";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { demoFather, demoMother, demoDataset } from "@/lib/demoDataset";
import { careReport, consentSharing } from "@/lib/mockData";

const MOTHER_CARE_ACTIONS: CareActionItem[] = [
  {
    id: "mom_lumbar_cushion",
    parentName: demoMother.displayName,
    title: "허리 쿠션 메모하기",
    kind: "care-item",
    description: "바로 구매보다 먼저, 엄마가 오래 앉아 있는 시간에 불편함이 있는지 자연스럽게 확인해요.",
    actionLabel: "메모하기",
    evidence: [demoMother.careSignals[0].evidence, demoMother.conversationMemos[1].memo, `관심사: ${demoMother.preferenceProfile.interests.slice(0, 3).join(", ")}`],
    reasoning: "허리 이야기가 반복되지만 직접적인 건강 질문은 부담스러울 수 있어, 실용적인 쿠션을 메모해두고 일상 안부로 먼저 확인하는 흐름이 좋아요."
  },
  {
    id: "mom_heat_pack",
    parentName: demoMother.displayName,
    title: "찜질팩 챙겨드리기",
    kind: "care-item",
    description: "허리 이야기를 바로 병원 이야기로 넘기지 않고, 집에서 편하게 쓸 수 있는 케어 아이템으로 연결해요.",
    actionLabel: "이번 주말에 하기",
    evidence: [demoMother.careSignals[0].title, demoMother.conversationMemos[1].suggestedFollowUp, `${demoMother.preferenceProfile.birthday.label} 이후 건강 챙김 맥락`],
    reasoning: "생신 이후 고마움과 건강 신호가 함께 있어, 부담 낮은 찜질팩은 선물보다 케어 행동에 가깝게 전달할 수 있어요."
  },
  {
    id: "mom_hospital_help",
    parentName: demoMother.displayName,
    title: "병원 예약 도와드리기",
    kind: "care-action",
    description: "바로 예약을 밀어붙이기보다, 원하시면 알아봐드릴게요 정도의 낮은 압박으로 제안해요.",
    actionLabel: "액션으로 저장",
    evidence: [demoMother.careSignals[0].recommendationHint, demoMother.preferenceProfile.avoidedTopics[0], demoMother.conversationMemos[1].title],
    reasoning: "건강 신호는 있지만 직접적인 병원 압박은 피해야 하므로, 선택권을 부모님께 두는 문장이 적합합니다."
  }
];

const FATHER_CARE_ACTIONS: CareActionItem[] = [
  {
    id: "dad_short_walk",
    parentName: demoFather.displayName,
    title: "짧은 산책 제안하기",
    kind: "care-action",
    description: "등산 사진에 반응한 뒤 무릎 부담이 적은 코스로 같이 걷자고 제안해요.",
    actionLabel: "이번 주말에 하기",
    evidence: [demoFather.careSignals[1].evidence, demoFather.conversationMemos[0].suggestedFollowUp, `관심사: ${demoFather.preferenceProfile.interests.slice(0, 3).join(", ")}`],
    reasoning: "아빠는 짧고 실용적인 말투를 선호하고 등산/산책 사진을 자주 공유하므로, 긴 걱정보다 짧은 산책 제안이 자연스럽습니다."
  }
];

const PARENT_DATA = {
  [demoDataset.parents[0].id]: {
    eyebrow: "엄마 근황",
    headline: "요즘 허리, 반찬, 생신 이야기를 자주 하세요",
    topics: ["허리 통증 언급 (3회)", "생신 이후 감사 인사", "저녁 메뉴 & 식사 안부"],
    careActions: MOTHER_CARE_ACTIONS,
    aiSummary: demoMother.agentSeedSummary.parentBriefing.summary,
    tone: demoMother.agentSeedSummary.warmReplyAI.reason
  },
  [demoDataset.parents[1].id]: {
    eyebrow: "아빠 근황",
    headline: "요즘 무릎, 등산, 야구 이야기를 자주 하세요",
    topics: ["등산/산책 사진 공유 (빈번)", "무릎 뻐근 언급 (1회)", "야구 중계 & 뉴스 링크"],
    careActions: FATHER_CARE_ACTIONS,
    aiSummary: demoFather.agentSeedSummary.parentBriefing.summary,
    tone: demoFather.agentSeedSummary.warmReplyAI.reason
  }
};

export default function ChildCarePage() {
  const [selectedParentId, setSelectedParentId] = useState(demoDataset.parents[0].id);
  const isMom = selectedParentId === demoDataset.parents[0].id;
  const data = PARENT_DATA[selectedParentId];

  return (
    <ChildAppShell className={`bg-gradient-to-b ${isMom ? "from-[#E8F3E5]" : "from-[#E0EDF5]"} via-cream-50 to-white`}>
      {/* Header */}
      <header style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>
          부모님 근황
        </p>
        <h1 style={{ fontSize: "24px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>
          최근 대화 요약
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          대화 기반으로 요약한 근황과 케어 액션이에요.
        </p>
      </header>

      {/* 부모 토글 */}
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
                    ? "linear-gradient(135deg, #7AB87A, #5A9E5A)"
                    : "linear-gradient(135deg, #7DA8C8, #5A8AB0)"
                  : "white",
                color: isActive ? "white" : "#8A6B5C",
                border: isActive ? "none" : "1.5px solid #F0E4D8",
                borderRadius: "999px",
                padding: "9px 22px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: isActive
                  ? isMomTab
                    ? "0 4px 12px rgba(122,184,122,0.3)"
                    : "0 4px 12px rgba(125,168,200,0.3)"
                  : "none"
              }}
            >
              {parent.displayName}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 부모님 근황 요약 AI */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>{data.eyebrow}</p>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#7AB87A", fontWeight: 600 }}>
              <Sparkles size={12} /> AI 요약
            </span>
          </div>
          <p style={{ fontSize: "16px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
            {data.headline}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {data.topics.map((topic) => (
              <div
                key={topic}
                style={{
                  background: "#FBF6F0",
                  borderRadius: "10px",
                  padding: "9px 13px",
                  fontSize: "13px",
                  color: "#5F4534"
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* 근황 상세 타임라인 링크 */}
        <div
          style={{
            background: isMom ? "#E8F3E5" : "#E0EDF5",
            borderRadius: "16px",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          <div>
            <p style={{ fontSize: "13px", color: isMom ? "#1F4A1F" : "#1A3A55", margin: "0 0 2px", fontWeight: 600 }}>
              근황 상세 타임라인
            </p>
            <p style={{ fontSize: "11px", color: isMom ? "#3A6B3A" : "#2C5A7A", margin: 0 }}>
              대화 기반 시간순 정리 · 감정 톤 변화
            </p>
          </div>
          <ChevronRight size={16} style={{ color: isMom ? "#3A6B3A" : "#2C5A7A" }} />
        </div>

        {/* AI 감지 신호 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>
            {careReport.aiSignals.label}
          </p>
          <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
            {data.aiSummary}
          </p>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.55, background: "#FBF6F0", borderRadius: "12px", padding: "12px 14px" }}>
            {data.tone}
          </p>
        </div>

        {/* 오늘의 따뜻한 일 */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
            borderRadius: "18px",
            padding: "18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 6px", fontWeight: 500 }}>
            {careReport.warmAction.title}
          </p>
          <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.4 }}>
            {careReport.warmAction.headline}
          </p>
          <p style={{ fontSize: "13px", color: "#5F4534", margin: 0, lineHeight: 1.55 }}>
            {careReport.warmAction.body}
          </p>
        </div>
      </div>

      <CareActionCard
        consentNotice={{ title: consentSharing.childNoticeTitle, body: consentSharing.childNoticeBody }}
        actions={data.careActions}
      />
    </ChildAppShell>
  );
}
