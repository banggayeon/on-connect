"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { ParentToggle } from "@/components/child/ParentToggle";
import { WeeklyEmotionFlow } from "@/components/child/WeeklyEmotionFlow";
import { EmotionSignalTags } from "@/components/child/EmotionSignalTags";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { careReport, mockCareActions, mockCheckIns } from "@/lib/mockData";
import type { ConsentSettings } from "@/lib/mockData";

const ACTION_TYPE_ICON: Record<string, string> = {
  call: "📞",
  message: "💬",
  visit: "🚶",
  gift: "🎁"
};

const PARENT_SUMMARIES: Record<string, { headline: string; keywords: string[]; tone: string }> = {
  parent_mother: {
    headline: "요즘 허리, 반찬, 생신 이야기를 자주 하세요",
    keywords: ["허리 통증", "저녁 식사", "생신 이후", "화분"],
    tone: "최근 대화 톤이 따뜻해요"
  },
  parent_father: {
    headline: "요즘 무릎, 등산, 야구 이야기를 자주 하세요",
    keywords: ["등산 사진", "무릎 뻐근", "야구 중계", "산책"],
    tone: "걱정되는 건강 신호가 있어요"
  }
};

export default function ChildCarePage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();
  const isMom = selectedParentId === "parent_mother";
  const summary = PARENT_SUMMARIES[selectedParentId] ?? PARENT_SUMMARIES.parent_mother;
  const actions = mockCareActions.filter((a) => a.parentId === selectedParentId);
  const [consent, setConsent] = useState<ConsentSettings>({ healthShare: true, moodShare: true, memoShare: false, activityShare: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("parentConsent");
      if (saved) setConsent(JSON.parse(saved));
    } catch {}
  }, []);

  return (
    <ChildAppShell className={`bg-gradient-to-b ${isMom ? "from-[#E8F3E5]" : "from-[#E0EDF5]"} via-cream-50 to-white`}>
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
      <ParentToggle variant="green" />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 부모님 근황 요약 AI 카드 */}
        <button
          type="button"
          onClick={() => router.push("/child/care/summary")}
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>
              {parentProfile.displayName} 근황 요약
            </p>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#7AB87A", fontWeight: 600 }}>
              <Sparkles size={12} /> AI
            </span>
          </div>
          <p style={{ fontSize: "16px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
            {summary.headline}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {summary.keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  fontSize: "12px",
                  background: isMom ? "#E8F3E5" : "#E0EDF5",
                  color: isMom ? "#3A6B3A" : "#2C5A7A",
                  borderRadius: "999px",
                  padding: "4px 12px",
                  fontWeight: 500
                }}
              >
                {kw}
              </span>
            ))}
          </div>

          {consent.moodShare ? (
            <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <WeeklyEmotionFlow checkIns={mockCheckIns} />
              <EmotionSignalTags checkIns={mockCheckIns} />
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#C5A898", margin: "0 0 12px" }}>
              기분 공유를 설정하면 이번 주 감정 흐름을 볼 수 있어요
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FBF6F0",
              borderRadius: "12px",
              padding: "10px 14px"
            }}
          >
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>상세 타임라인 보기</p>
            <ChevronRight size={14} style={{ color: "#B07A5C" }} />
          </div>
        </button>

        {/* 케어 액션 추천 리스트 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0, fontWeight: 500 }}>케어 액션 추천</p>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#7AB87A", fontWeight: 600 }}>
              <Sparkles size={12} /> AI
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => router.push(`/child/care/action/${action.id}`)}
                style={{
                  background: "#FBF6F0",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{ACTION_TYPE_ICON[action.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 3px", fontWeight: 600 }}>{action.title}</p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#8A6B5C",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {action.reason}
                  </p>
                </div>
                <ChevronRight size={14} style={{ color: "#B07A5C", flexShrink: 0 }} />
              </button>
            ))}
          </div>
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
    </ChildAppShell>
  );
}
