"use client";

import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import { demoDataset } from "@/lib/mockData";
import type { ContactRecord } from "@/lib/types";

function getRhythmSummary(records: ContactRecord[], referenceDate: string): string {
  const ref = new Date(referenceDate);
  const sevenDaysAgo = new Date(ref.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = records.filter((r) => new Date(r.date) >= sevenDaysAgo);
  const count = recent.length;
  if (count >= 5) return "이번 주는 대화가 활발하게 이어졌어요.";
  if (count >= 3) return "이번 주는 대화가 조금 더 이어졌어요.";
  if (count >= 1) return "이번 주 가볍게 안부를 나눴어요.";
  return "이번 주는 연락이 조금 뜸했어요.";
}

function FlowBar({ label, value, max, color, valueText }: { label: string; value: number; max: number; color: string; valueText?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, fontWeight: 600 }}>{valueText ?? `${value}회`}</p>
      </div>
      <div style={{ height: "7px", background: "#E8DECF", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function WeeklyFlowChart({ data, tone }: { data: number[]; tone: string }) {
  const max = Math.max(...data, 5);
  const min = 0;
  const h = 52;
  const w = 280;
  const barW = w / data.length - 4;
  return (
    <svg width="100%" height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} style={{ overflow: "visible" }}>
      {data.map((v, i) => {
        const barH = Math.max(4, min === max ? h / 2 : ((v - min) / (max - min)) * h);
        const x = i * (w / data.length) + 2;
        const y = h - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={isLast ? "#241E1A" : tone} />
            {isLast && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#241E1A" fontWeight="600">
                {v}회
              </text>
            )}
          </g>
        );
      })}
      {["1주전","6일","5일","4일","3일","2일","오늘"].map((d, i) => (
        <text key={d} x={i * (w / 7) + (barW / 2) + 2} y={h + 16} textAnchor="middle" fontSize={9} fill="#8A6B5C">
          {d}
        </text>
      ))}
    </svg>
  );
}

export default function RhythmPage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();
  const result = calculateRelationshipTemperature(selectedParentId, demoDataset, demoDataset.generatedAt);
  const bd = result.scoreBreakdown;
  const isMom = selectedParentId === "parent_mother";
  const cardTone = isMom ? "#F1D6CC" : "#CDDCC8";
  const barTone = isMom ? "#F1D6CC" : "#CDDCC8";

  const parentData = demoDataset.parents.find((p) => p.id === selectedParentId);
  const records = parentData?.contactRecords30Days ?? [];
  const rhythmSummary = getRhythmSummary(records, demoDataset.generatedAt);

  const weeklyContacts = [2, 3, 1, 4, 2, 3, bd.checkin.count7Days];

  return (
    <DetailScreen title="관계 리듬">
      {/* 리듬 요약 카드 */}
      <div
        style={{
          background: cardTone, borderRadius: "26px",
          padding: "26px 22px", marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 8px", fontWeight: 500 }}>
          {parentProfile.displayName}와의 온기 흐름
        </p>
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#241E1A", margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
          {rhythmSummary}
        </p>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, opacity: 0.8 }}>
          {result.label} · 이번 주 {bd.checkin.count7Days}회 안부
        </p>
      </div>

      {/* 주간 연락 흐름 */}
      <div
        style={{
          background: "#FFFBF2", borderRadius: "26px",
          padding: "18px", border: "1px solid #E8DECF", marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 16px", fontWeight: 500 }}>최근 7일 온기 흐름</p>
        <WeeklyFlowChart data={weeklyContacts} tone={barTone} />
      </div>

      {/* 연락 흐름 구성 */}
      <div
        style={{
          background: "#FFFBF2", borderRadius: "26px",
          padding: "18px", border: "1px solid #E8DECF", marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 16px", fontWeight: 500 }}>연락 흐름 구성</p>
        <FlowBar label="안부 횟수 (최근 7일)" value={bd.checkin.count7Days} max={bd.checkin.targetCount} color="#F1D6CC" />
        <FlowBar label="통화 횟수 (최근 7일)" value={bd.calls.count7Days} max={bd.calls.targetCount} color="#F6D6BD" />
        <FlowBar label="평균 답장 속도" value={bd.replySpeed.score} max={40 * bd.replySpeed.weight} color="#CDDCC8"
          valueText={bd.replySpeed.averageMinutes != null ? `${Math.round(bd.replySpeed.averageMinutes)}분` : "—"} />
        <FlowBar label="대화 깊이" value={bd.depth.score} max={40 * bd.depth.weight} color="#D9D0E5"
          valueText={bd.depth.label} />
        <FlowBar label="연락 주고받기 균형" value={bd.balance.score} max={40 * bd.balance.weight} color="#D8E0A6"
          valueText={bd.balance.label} />
      </div>

      {/* 맥락 안내 */}
      <div
        style={{
          background: "#D8E0A6", borderRadius: "26px",
          padding: "16px 18px", marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 10px", fontWeight: 500 }}>맥락 안내</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {result.insights.map((insight, i) => (
            <p key={i} style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
              • {insight}
            </p>
          ))}
        </div>
      </div>

      {/* 다음 안부 추천 */}
      <button
        type="button"
        onClick={() => router.push("/child/signal/recommend")}
        style={{
          width: "100%", background: "#241E1A", color: "#FBF6EC",
          border: "none", borderRadius: "999px",
          padding: "16px 18px", fontSize: "15px", fontWeight: 600,
          cursor: "pointer", marginBottom: "10px"
        }}
      >
        다음 안부 추천받기
      </button>

      <button
        type="button"
        onClick={() => router.push("/child/home/temperature/history")}
        style={{
          width: "100%", background: "#FFFBF2", border: "1px solid #E8DECF",
          borderRadius: "999px", padding: "15px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span style={{ fontSize: "14px", color: "#241E1A", fontWeight: 500 }}>연락 기록 자세히 보기</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </DetailScreen>
  );
}
