"use client";

import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import { demoDataset } from "@/lib/mockData";

function ScoreBar({ label, value, max, color, valueText }: { label: string; value: number; max: number; color: string; valueText?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, fontWeight: 600 }}>{valueText ?? `${value}회`}</p>
      </div>
      <div style={{ height: "8px", background: "#E8DECF", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function WeeklyChart({ data, tone }: { data: number[]; tone: string }) {
  const max = Math.max(...data, 38.5);
  const min = 33;
  const h = 60;
  const w = 280;
  const barW = w / data.length - 4;

  return (
    <svg width="100%" height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} style={{ overflow: "visible" }}>
      {data.map((v, i) => {
        const barH = Math.max(4, ((v - min) / (max - min)) * h);
        const x = i * (w / data.length) + 2;
        const y = h - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={isLast ? "#241E1A" : tone} />
            {isLast && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#241E1A" fontWeight="600">
                {v.toFixed(1)}°
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

export default function TemperaturePage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();
  const result = calculateRelationshipTemperature(selectedParentId, demoDataset, demoDataset.generatedAt);
  const bd = result.scoreBreakdown;
  const isMom = selectedParentId === "parent_mother";
  const cardTone = isMom ? "#F1D6CC" : "#CDDCC8";
  const barTone = isMom ? "#F1D6CC" : "#CDDCC8";

  const weeklyTemps = [35.2, 35.5, 35.8, 36.0, 36.2, 36.5, result.temperature];

  return (
    <DetailScreen title="관계 온도">
      {/* 현재 온도 */}
      <div
        style={{
          background: cardTone,
          borderRadius: "26px",
          padding: "28px 24px",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 8px", fontWeight: 500 }}>
          {parentProfile.displayName}와의 연결 온도
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "52px", fontWeight: 700, color: "#241E1A", lineHeight: 1 }}>
            {result.temperature.toFixed(1)}°
          </span>
          <span style={{ fontSize: "16px", color: "#3D332C" }}>{result.label}</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.5)", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.max(8, ((result.temperature - 33) / (38.5 - 33)) * 100))}%`,
              background: "#241E1A",
              borderRadius: "999px"
            }}
          />
        </div>
      </div>

      {/* 주간 변화 그래프 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 16px", fontWeight: 500 }}>최근 7일 온도 변화</p>
        <WeeklyChart data={weeklyTemps} tone={barTone} />
      </div>

      {/* 항목별 점수 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 16px", fontWeight: 500 }}>항목별 점수</p>
        <ScoreBar label="안부 횟수 (최근 7일)" value={bd.checkin.count7Days} max={bd.checkin.targetCount} color="#F1D6CC" />
        <ScoreBar label="통화 횟수 (최근 7일)" value={bd.calls.count7Days} max={bd.calls.targetCount} color="#F6D6BD" />
        <ScoreBar label="평균 답장 속도" value={bd.replySpeed.score} max={40 * bd.replySpeed.weight} color="#CDDCC8"
          valueText={bd.replySpeed.averageMinutes != null ? `${Math.round(bd.replySpeed.averageMinutes)}분` : "—"} />
        <ScoreBar label="감정 대화 깊이" value={bd.depth.score} max={40 * bd.depth.weight} color="#D9D0E5"
          valueText={bd.depth.label} />
        <ScoreBar label="연락 균형" value={bd.balance.score} max={40 * bd.balance.weight} color="#D8E0A6"
          valueText={bd.balance.label} />
      </div>

      {/* 인사이트 */}
      <div
        style={{
          background: "#D8E0A6",
          borderRadius: "26px",
          padding: "16px 18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 10px", fontWeight: 500 }}>AI 인사이트</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {result.insights.map((insight, i) => (
            <p key={i} style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
              • {insight}
            </p>
          ))}
        </div>
      </div>

      {/* 연락 기록 보기 */}
      <button
        type="button"
        onClick={() => router.push("/child/home/temperature/history")}
        style={{
          width: "100%",
          background: "#FFFBF2",
          border: "1px solid #E8DECF",
          borderRadius: "999px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span style={{ fontSize: "14px", color: "#241E1A", fontWeight: 600 }}>연락 기록 보기</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12L10 8L6 4" stroke="#8A6B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </DetailScreen>
  );
}
