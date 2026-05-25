"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
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
        <p style={{ fontSize: "13px", color: "#3D2419", margin: 0, fontWeight: 600 }}>{valueText ?? `${value}회`}</p>
      </div>
      <div style={{ height: "8px", background: "#F0E4D8", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

// 간단한 7일 바 차트 (SVG)
function WeeklyChart({ data }: { data: number[] }) {
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
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={isLast ? "#E07856" : "#FFD4C2"} />
            {isLast && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#E07856" fontWeight="600">
                {v.toFixed(1)}°
              </text>
            )}
          </g>
        );
      })}
      {["1주전","6일","5일","4일","3일","2일","오늘"].map((d, i) => (
        <text key={d} x={i * (w / 7) + (barW / 2) + 2} y={h + 16} textAnchor="middle" fontSize={9} fill="#B07A5C">
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

  // 최근 7일 온도 mock 추이 (마지막이 현재)
  const weeklyTemps = [35.2, 35.5, 35.8, 36.0, 36.2, 36.5, result.temperature];

  return (
    <DetailScreen title="관계 온도" className={`bg-gradient-to-b ${isMom ? "from-[#FFEDE0]" : "from-[#FFF5E8]"} to-white`}>
      {/* 현재 온도 큰 표시 */}
      <div
        style={{
          background: isMom
            ? "linear-gradient(135deg, #FF8A65, #E07856)"
            : "linear-gradient(135deg, #E8A04E, #D4883A)",
          borderRadius: "24px",
          padding: "28px 24px",
          marginBottom: "16px",
          boxShadow: isMom ? "0 12px 28px rgba(224,120,86,0.3)" : "0 10px 24px rgba(232,160,78,0.28)"
        }}
      >
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.88)", margin: "0 0 8px", fontWeight: 500 }}>
          {parentProfile.displayName}와의 연결 온도
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "52px", fontWeight: 500, color: "white", lineHeight: 1 }}>
            {result.temperature.toFixed(1)}°
          </span>
          <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.88)" }}>{result.label}</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.3)", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.max(8, ((result.temperature - 33) / (38.5 - 33)) * 100))}%`,
              background: "white",
              borderRadius: "999px"
            }}
          />
        </div>
      </div>

      {/* 주간 변화 그래프 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 16px", fontWeight: 500 }}>최근 7일 온도 변화</p>
        <WeeklyChart data={weeklyTemps} />
      </div>

      {/* 항목별 점수 분해 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 16px", fontWeight: 500 }}>항목별 점수</p>
        <ScoreBar label="안부 횟수 (최근 7일)" value={bd.checkin.count7Days} max={bd.checkin.targetCount} color="#E07856" />
        <ScoreBar label="통화 횟수 (최근 7일)" value={bd.calls.count7Days} max={bd.calls.targetCount} color="#E8A04E" />
        <ScoreBar
          label="평균 답장 속도"
          value={bd.replySpeed.score}
          max={40 * bd.replySpeed.weight}
          color="#7AB87A"
          valueText={bd.replySpeed.averageMinutes != null ? `${Math.round(bd.replySpeed.averageMinutes)}분` : "—"}
        />
        <ScoreBar
          label="감정 대화 깊이"
          value={bd.depth.score}
          max={40 * bd.depth.weight}
          color="#7DA8C8"
          valueText={bd.depth.label}
        />
        <ScoreBar
          label="연락 균형"
          value={bd.balance.score}
          max={40 * bd.balance.weight}
          color="#C8A0E0"
          valueText={bd.balance.label}
        />
      </div>

      {/* 인사이트 */}
      <div
        style={{
          background: "#E8F3E5",
          borderRadius: "16px",
          padding: "16px 18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#3A6B3A", margin: "0 0 10px", fontWeight: 500 }}>AI 인사이트</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {result.insights.map((insight, i) => (
            <p key={i} style={{ fontSize: "14px", color: "#1F4A1F", margin: 0, lineHeight: 1.5 }}>
              • {insight}
            </p>
          ))}
        </div>
      </div>

      {/* 연락 기록 보기 버튼 */}
      <button
        type="button"
        onClick={() => router.push("/child/home/temperature/history")}
        style={{
          width: "100%",
          background: "white",
          border: "1.5px solid #F0E4D8",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span style={{ fontSize: "14px", color: "#3D2419", fontWeight: 600 }}>연락 기록 보기</span>
        <ChevronRight size={16} style={{ color: "#B07A5C" }} />
      </button>
    </DetailScreen>
  );
}
