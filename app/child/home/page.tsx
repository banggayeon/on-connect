"use client";

import { useRouter } from "next/navigation";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { childProfile, demoDataset, mockDailyQuestions } from "@/lib/mockData";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";

const allTemperatures = demoDataset.parents.map((parent) => {
  const result = calculateRelationshipTemperature(parent.id, demoDataset, demoDataset.generatedAt);
  return {
    parentId: parent.id,
    displayName: parent.displayName,
    temperature: result.temperature,
    label: result.label,
    delta: result.delta
  };
});

const CARD_TONES = ["#F1D6CC", "#D8E0A6"];

function formatDelta(delta: number) {
  return delta > 0 ? `+${delta}° 따뜻해요` : `${delta}° 식었어요`;
}

function ArrowDot({ color = "#241E1A", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ChildHomePage() {
  const router = useRouter();
  const { setSelectedParentId } = useSelectedParent();
  const todayQuestion = mockDailyQuestions[0];

  function handleTempCardClick(parentId: string) {
    setSelectedParentId(parentId as "parent_mother" | "parent_father");
    router.push("/child/home/temperature");
  }

  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  return (
    <ChildAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500, letterSpacing: "-0.005em" }}>
          {today}
        </p>
        <div style={{
          width: "36px", height: "36px", borderRadius: "999px",
          border: "1px solid #E8DECF", background: "#FFFBF2",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="2.6" stroke="#241E1A" strokeWidth="1.4"/>
            <path d="M3 13.5c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2" stroke="#241E1A" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <h1 style={{
        fontSize: "34px", lineHeight: 1.22, fontWeight: 700,
        letterSpacing: "-0.03em", margin: "0 0 22px", color: "#241E1A"
      }}>
        오늘, 한 번 더<br/>가까워져요
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 부모님별 관계 온도 카드 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {allTemperatures.map((parent, idx) => (
            <button
              key={parent.parentId}
              type="button"
              onClick={() => handleTempCardClick(parent.parentId)}
              style={{
                background: CARD_TONES[idx % CARD_TONES.length],
                borderRadius: "22px",
                padding: "18px 16px 16px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
                  {parent.displayName}
                </span>
                <span style={{
                  width: "26px", height: "26px", borderRadius: "999px",
                  border: "1px solid rgba(36,30,26,0.5)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,251,242,0.5)"
                }}>
                  <ArrowDot size={10}/>
                </span>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#241E1A", opacity: 0.6, margin: "0 0 3px" }}>관계 온도</p>
                <p style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.02em", color: "#241E1A", margin: 0 }}>
                  {parent.temperature.toFixed(1)}°C
                </p>
              </div>
              <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(36,30,26,0.16)" }}>
                <p style={{ fontSize: "12px", color: "#241E1A", opacity: 0.65, margin: 0 }}>
                  {formatDelta(parent.delta)}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* 오늘의 질문 */}
        <button
          type="button"
          onClick={() => router.push("/child/home/question")}
          style={{
            background: "#FFFBF2",
            borderRadius: "18px",
            padding: "18px",
            border: "1px solid #E8DECF",
            cursor: "pointer",
            textAlign: "left",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>오늘의 질문</p>
            <ArrowDot color="#6E4A39"/>
          </div>
          <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.45, letterSpacing: "-0.01em" }}>
            {todayQuestion.question}
          </p>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>답변하러 가기</p>
        </button>

        {/* AI 브리핑 */}
        <button
          type="button"
          onClick={() => router.push("/child/signal/recommend")}
          style={{
            background: "#F6D6BD",
            borderRadius: "18px",
            padding: "18px",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            display: "block"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ fontSize: "12.5px", color: "#3D332C", margin: 0, fontWeight: 500, letterSpacing: "-0.005em" }}>
              AI 브리핑
            </p>
            <ArrowDot color="#3D332C" size={13}/>
          </div>
          <p style={{ fontSize: "16px", color: "#241E1A", margin: "0 0 6px", fontWeight: 600, lineHeight: 1.45, letterSpacing: "-0.015em" }}>
            엄마는 오늘 가벼운<br/>식사 안부가 좋아요.
          </p>
          <p style={{ fontSize: "13px", color: "#241E1A", opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
            최근 식사 주제에 빠르게 반응했어요.
          </p>
        </button>

        {/* CTA 버튼들 */}
        <button
          type="button"
          onClick={() => router.push("/child/signal/recommend")}
          style={{
            width: "100%", background: "#241E1A", color: "#FBF6EC",
            border: "none", borderRadius: "999px",
            padding: "17px 22px", fontSize: "16px", fontWeight: 500,
            cursor: "pointer", letterSpacing: "-0.012em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          가볍게 안부 보내기
          <ArrowDot color="#FBF6EC"/>
        </button>
      </div>
    </ChildAppShell>
  );
}
