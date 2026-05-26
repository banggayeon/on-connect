"use client";

import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import { demoDataset } from "@/lib/mockData";

// ── 자녀 대화 데이터 도출 ─────────────────────────────────────────────────────

function buildChildReport(parentId: string) {
  const child = demoDataset.child;
  const parent = demoDataset.parents.find((p) => p.id === parentId) ?? demoDataset.parents[0];
  const records = parent.contactRecords30Days ?? [];

  // 자녀가 먼저 보낸 메시지
  const childInitiated = records.filter((r) => r.direction === "childToParent");

  // 자녀 답장 속도
  const latencies = childInitiated
    .map((r) => r.responseLatencyMinutes)
    .filter((v): v is number => v != null);
  const avgReplyMinutes =
    latencies.length > 0
      ? Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length)
      : null;

  // 최근 7일 자녀 연락
  const sevenDaysAgo = new Date(demoDataset.generatedAt);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentChildMessages = childInitiated.filter(
    (r) => new Date(r.date) >= sevenDaysAgo
  );

  // 자녀가 꺼낸 주요 태그
  const allTags = childInitiated.flatMap((r) => r.tags);
  const tagCount: Record<string, number> = {};
  for (const tag of allTags) tagCount[tag] = (tagCount[tag] ?? 0) + 1;
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  const tagLabels: Record<string, string> = {
    meal: "식사", health: "건강", work: "업무", photo: "사진",
    weekend: "주말", walk: "산책", birthday: "생신", visit: "방문",
    evening: "저녁", parents_day: "어버이날", hiking: "등산",
    baseball: "야구", driving: "운전", friends: "지인 모임",
  };
  const topicLabels = topTags.map((t) => tagLabels[t] ?? t).join(", ");

  // 대화 균형
  const total = records.length;
  const childRatio = total > 0 ? Math.round((childInitiated.length / total) * 100) : 0;
  const balanceLabel =
    childRatio >= 50
      ? `자녀가 먼저 연락한 비율: ${childRatio}%`
      : `부모님이 먼저 연락한 비율: ${100 - childRatio}%`;

  // 최근 자녀 메시지 3개 요약
  const recentSummaries = childInitiated
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((r) => r.summary);

  return {
    childName: child.name,
    avgReplyMinutes,
    recentChildCount: recentChildMessages.length,
    topicLabels,
    balanceLabel,
    recentSummaries,
  };
}

function FlowBar({ label, value, max, color, valueText }: {
  label: string; value: number; max: number; color: string; valueText?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, fontWeight: 600 }}>
          {valueText ?? `${value}회`}
        </p>
      </div>
      <div style={{ height: 8, background: "#E8DECF", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

export default function ParentReportPage() {
  const router = useRouter();

  const parentId = "parent_mother";
  const result = calculateRelationshipTemperature(parentId, demoDataset, demoDataset.generatedAt);
  const bd = result.scoreBreakdown;
  const report = buildChildReport(parentId);

  const avgReplyLabel =
    report.avgReplyMinutes == null
      ? "—"
      : report.avgReplyMinutes <= 30
      ? `약 ${report.avgReplyMinutes}분`
      : `약 ${report.avgReplyMinutes}분`;

  const recentCountLabel =
    report.recentChildCount >= 4
      ? "자녀가 이번 주 여러 번 먼저 연락했어요"
      : report.recentChildCount >= 2
      ? "자녀가 이번 주 몇 번 먼저 연락했어요"
      : report.recentChildCount === 1
      ? "자녀가 이번 주 한 번 먼저 연락했어요"
      : "이번 주 자녀의 연락이 뜸했어요";

  return (
    <ParentAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#241E1A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: "var(--parent-font-title, 28px)", color: "#241E1A", margin: 0, fontWeight: 700, letterSpacing: "-0.025em" }}>
          관계 리포트
        </h1>
      </div>

      {/* 온기 요약 카드 */}
      <div style={{ background: "#F1D6CC", borderRadius: 24, padding: "24px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 8px", fontWeight: 500 }}>
          {report.childName}이와의 대화 흐름
        </p>
        <p style={{ fontSize: "var(--parent-font-title, 30px)", fontWeight: 700, color: "#241E1A", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
          {result.temperature.toFixed(1)}° · {result.label}
        </p>
        <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
          {result.reasons[0]}
        </p>
      </div>

      {/* 연락 흐름 구성 */}
      <div style={{ background: "#FFFBF2", border: "1.5px solid #E8DECF", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 16px", fontWeight: 500 }}>연락 흐름 구성</p>
        <FlowBar label="안부 횟수 (최근 7일)" value={bd.checkin.count7Days} max={bd.checkin.targetCount} color="#F1D6CC" />
        <FlowBar label="통화 횟수 (최근 7일)" value={bd.calls.count7Days} max={bd.calls.targetCount} color="#F6D6BD" />
        <FlowBar label="평균 답장 속도" value={bd.replySpeed.score} max={40 * bd.replySpeed.weight} color="#CDDCC8"
          valueText={avgReplyLabel} />
        <FlowBar label="대화 깊이" value={bd.depth.score} max={40 * bd.depth.weight} color="#D9D0E5"
          valueText={bd.depth.label} />
      </div>

      {/* 자녀의 대화 주제 */}
      <div style={{ background: "#FFFBF2", border: "1.5px solid #E8DECF", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", fontWeight: 500 }}>
          {report.childName}이가 자주 꺼낸 주제
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 7, height: 7, borderRadius: 999, background: "#F1D6CC", flexShrink: 0, marginTop: 8 }} />
            <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
              주요 주제: {report.topicLabels}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 7, height: 7, borderRadius: 999, background: "#F1D6CC", flexShrink: 0, marginTop: 8 }} />
            <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
              {report.balanceLabel}
            </p>
          </div>
          {report.recentSummaries.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 7, height: 7, borderRadius: 999, background: "#F1D6CC", flexShrink: 0, marginTop: 8 }} />
              <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 이번 주 흐름 */}
      <div style={{ background: "#D8E0A6", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 10px", fontWeight: 500 }}>이번 주 흐름</p>
        <p style={{ fontSize: "var(--parent-font-base, 20px)", color: "#241E1A", margin: 0, lineHeight: 1.5, letterSpacing: "-0.015em" }}>
          {recentCountLabel}. 식사나 일상 주제로 먼저 짧게 안부를 건네보세요.
        </p>
      </div>

      {/* 맥락 참고 */}
      {result.insights.length > 0 && (
        <div style={{ background: "#FFFBF2", border: "1.5px solid #E8DECF", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>참고 사항</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.insights.map((insight, i) => (
              <p key={i} style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
                • {insight}
              </p>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: "13px", color: "#8A6B5C", textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
        자녀가 직접 공유하지 않은 정보는 사용하지 않아요
      </p>
    </ParentAppShell>
  );
}
