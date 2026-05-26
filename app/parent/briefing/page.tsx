"use client";

import { useRouter } from "next/navigation";
import { ParentAppShell } from "@/components/parent/ParentAppShell";
import { demoDataset } from "@/lib/mockData";

// ── 자녀 데이터에서 브리핑 항목 도출 ────────────────────────────────────────

function buildBriefing() {
  const child = demoDataset.child;
  const parent = demoDataset.parents[0]; // 현재 선택된 부모 — 엄마 기준

  // 최근 자녀 → 부모 메시지들
  const childMessages = (parent.contactRecords30Days ?? [])
    .filter((r) => r.direction === "childToParent")
    .sort((a, b) => b.date.localeCompare(a.date));

  // 자녀의 평균 답장 속도
  const latencies = childMessages
    .map((r) => r.responseLatencyMinutes)
    .filter((v): v is number => v != null);
  const avgMinutes =
    latencies.length > 0
      ? Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length)
      : null;

  // 최근 3개 자녀 메시지 요약
  const recentSummaries = childMessages.slice(0, 3).map((r) => r.summary);

  // 자녀가 자주 쓰는 채널
  const channels = childMessages.map((r) => r.channel);
  const callCount = channels.filter((c) => c === "call").length;
  const preferredChannel =
    callCount >= childMessages.length / 3 ? "통화" : "문자";

  const responseLabel =
    avgMinutes == null
      ? "답장 속도 정보 없음"
      : avgMinutes <= 30
      ? `보통 ${avgMinutes}분 이내로 답장해요`
      : avgMinutes <= 90
      ? `답장까지 보통 ${avgMinutes}분 정도 걸려요`
      : "바쁠 때는 답장이 조금 늦을 수 있어요";

  // 최근 7일 자녀 연락 수
  const sevenDaysAgo = new Date("2026-05-09");
  const recentCount = childMessages.filter(
    (r) => new Date(r.date) >= sevenDaysAgo
  ).length;
  const recentLabel =
    recentCount >= 4
      ? "이번 주 자녀가 먼저 연락한 경우가 많았어요"
      : recentCount >= 2
      ? "이번 주 자녀가 몇 번 먼저 연락했어요"
      : "이번 주 자녀의 연락이 조금 뜸했어요";

  return {
    childName: child.name,
    recentSummaries,
    responseLabel,
    preferredChannel,
    recentLabel,
  };
}

const briefing = buildBriefing();

export default function ParentBriefingPage() {
  const router = useRouter();

  const suggestedOpen =
    "오늘 저녁 뭐 먹었어? 요즘 어떻게 지내고 있어?";

  const evidenceItems = [
    briefing.recentLabel,
    briefing.responseLabel,
    `${briefing.childName}이가 최근에 꺼낸 주제: ${briefing.recentSummaries.join(" / ")}`,
    "식사나 주말 이야기로 시작하면 자연스럽게 이어져요",
  ];

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
          대화 전 브리핑
        </h1>
      </div>

      <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#8A6B5C", margin: "0 0 22px", lineHeight: 1.6 }}>
        {briefing.childName}이에게 연락하기 전, 알아두면 좋을 흐름을 정리해드려요.
      </p>

      {/* 지금 연락하면 카드 */}
      <div style={{ background: "#F1E5C8", borderRadius: 24, padding: "22px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 10px", fontWeight: 600, letterSpacing: "-0.005em" }}>
          지금 연락하면
        </p>
        <p style={{ fontSize: "var(--parent-font-title, 26px)", fontWeight: 700, color: "#241E1A", margin: "0 0 10px", lineHeight: 1.35, letterSpacing: "-0.025em" }}>
          {briefing.childName}이와 대화하기 좋은 타이밍이에요.
        </p>
        <p style={{ fontSize: "var(--parent-font-caption, 14px)", color: "#6E4A39", margin: 0, lineHeight: 1.6 }}>
          {briefing.recentLabel}. {briefing.responseLabel}.
        </p>
      </div>

      {/* 이렇게 시작하세요 */}
      <div style={{ background: "#FFFBF2", border: "1.5px solid #E8DECF", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>이렇게 시작해보세요</p>
        <p style={{
          fontSize: "var(--parent-font-base, 20px)", color: "#241E1A", margin: 0,
          lineHeight: 1.6, letterSpacing: "-0.015em", fontWeight: 500,
        }}>
          "{suggestedOpen}"
        </p>
      </div>

      {/* 참고한 흐름 */}
      <div style={{ background: "#FFFBF2", border: "1.5px solid #E8DECF", borderRadius: 24, padding: "20px", marginBottom: 14 }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", fontWeight: 500 }}>
          {briefing.childName}이의 최근 흐름
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {evidenceItems.map((ev, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 7, height: 7, borderRadius: 999,
                background: "#F1E5C8", flexShrink: 0, marginTop: 8,
              }} />
              <p style={{ fontSize: "var(--parent-font-caption, 15px)", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
                {ev}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "13px", color: "#8A6B5C", textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
        자녀가 직접 공유하지 않은 정보는 사용하지 않아요
      </p>
    </ParentAppShell>
  );
}
