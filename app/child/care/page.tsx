"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const keywordTone = isMom ? "#F1D6CC" : "#CDDCC8";

  return (
    <ChildAppShell>
      <header style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>
          부모님 근황
        </p>
        <h1 style={{ fontSize: "26px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
          최근 대화 요약
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          대화 기반으로 요약한 근황과 케어 액션이에요.
        </p>
      </header>

      <ParentToggle variant="green" />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 부모님 근황 요약 AI 카드 */}
        <button
          type="button"
          onClick={() => router.push("/child/care/summary")}
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF",
            cursor: "pointer",
            textAlign: "left",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>
              {parentProfile.displayName} 근황 요약
            </p>
            <span style={{ fontSize: "11px", color: "#241E1A", background: "#D8E0A6", padding: "3px 8px", borderRadius: "999px", fontWeight: 600 }}>
              AI
            </span>
          </div>
          <p style={{ fontSize: "16px", color: "#241E1A", margin: "0 0 12px", fontWeight: 600, lineHeight: 1.4 }}>
            {summary.headline}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {summary.keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  fontSize: "12px",
                  background: keywordTone,
                  color: "#241E1A",
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
            <p style={{ fontSize: "12px", color: "#9A8B7D", margin: "0 0 12px" }}>
              기분 공유를 설정하면 이번 주 감정 흐름을 볼 수 있어요
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F0E7D7",
              borderRadius: "999px",
              padding: "10px 14px"
            }}
          >
            <p style={{ fontSize: "12px", color: "#3D332C", margin: 0 }}>상세 타임라인 보기</p>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 11L9 7L5 3" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* 케어 액션 추천 리스트 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>케어 액션 추천</p>
            <span style={{ fontSize: "11px", color: "#241E1A", background: "#D8E0A6", padding: "3px 8px", borderRadius: "999px", fontWeight: 600 }}>
              AI
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => router.push(`/child/care/action/${action.id}`)}
                style={{
                  background: "#FAF6EE",
                  border: "none",
                  borderRadius: "18px",
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
                  <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 3px", fontWeight: 600 }}>{action.title}</p>
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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 11L9 7L5 3" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* 오늘의 따뜻한 일 */}
        <div
          style={{
            background: "#D8E0A6",
            borderRadius: "26px",
            padding: "18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 6px", fontWeight: 500 }}>
            {careReport.warmAction.title}
          </p>
          <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 6px", fontWeight: 600, lineHeight: 1.4 }}>
            {careReport.warmAction.headline}
          </p>
          <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, lineHeight: 1.55 }}>
            {careReport.warmAction.body}
          </p>
        </div>
      </div>
    </ChildAppShell>
  );
}
