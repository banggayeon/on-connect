"use client";

import { useEffect, useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { WeeklyEmotionFlow } from "@/components/child/WeeklyEmotionFlow";
import { EmotionSignalTags } from "@/components/child/EmotionSignalTags";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { mockCheckIns } from "@/lib/mockData";
import { analyzeEmotionMock } from "@/lib/ai/emotionAnalyzer";
import type { ConsentSettings } from "@/lib/mockData";

type KeywordStat = { word: string; count: number; color: string };

const PARENT_DATA: Record<string, {
  keywords: KeywordStat[];
  pattern: string;
  memos: Array<{ date: string; summary: string; tags: string[]; tone: "warm" | "neutral" | "concerned" }>;
}> = {
  parent_mother: {
    keywords: [
      { word: "허리", count: 3, color: "#E07856" },
      { word: "저녁 식사", count: 8, color: "#7AB87A" },
      { word: "화분", count: 2, color: "#7DA8C8" },
      { word: "생신", count: 4, color: "#E8A04E" },
      { word: "반찬", count: 5, color: "#7AB87A" }
    ],
    pattern: "3주 전부터 허리 이야기가 반복되고 있어요. 식사 주제에는 빠르게 답장하는 패턴이에요.",
    memos: [
      { date: "2026-05-16", summary: "오늘 저녁 뭐 먹니? — 저녁 식사 안부", tags: ["식사", "일상"], tone: "warm" },
      { date: "2026-05-12", summary: "허리가 아직 뻐근하다고 짧게 언급", tags: ["건강", "허리"], tone: "concerned" },
      { date: "2026-05-10", summary: "생신 축하 통화와 선물 감사 인사 (34분)", tags: ["생신", "가족"], tone: "warm" },
      { date: "2026-05-08", summary: "어버이날 감사 메시지 수신", tags: ["어버이날", "감사"], tone: "warm" },
      { date: "2026-05-05", summary: "집에서 만든 반찬 사진 공유", tags: ["음식", "사진"], tone: "warm" },
      { date: "2026-05-03", summary: "무릎보다 허리가 더 신경 쓰인다고 말함", tags: ["건강", "허리"], tone: "concerned" },
      { date: "2026-04-27", summary: "허리가 조금 뻐근하다고 언급 (첫 번째)", tags: ["건강", "허리"], tone: "concerned" }
    ]
  },
  parent_father: {
    keywords: [
      { word: "등산", count: 6, color: "#7AB87A" },
      { word: "무릎", count: 1, color: "#E07856" },
      { word: "야구", count: 3, color: "#E8A04E" },
      { word: "산책", count: 4, color: "#7DA8C8" },
      { word: "뉴스", count: 2, color: "#B07A5C" }
    ],
    pattern: "사진에 빠르게 반응할 때 대화가 이어지는 패턴이에요. 무릎 뻐근 언급이 최근 시작됐어요.",
    memos: [
      { date: "2026-05-16", summary: "새 등산로 표지판 사진 전송", tags: ["등산", "사진"], tone: "warm" },
      { date: "2026-05-15", summary: "주말 산책 약속 조율 (10분 통화)", tags: ["산책", "약속"], tone: "warm" },
      { date: "2026-05-14", summary: "야구 중계 시간 공유", tags: ["야구", "취미"], tone: "neutral" },
      { date: "2026-05-07", summary: "무릎이 약간 뻐근하다고 말함", tags: ["건강", "무릎"], tone: "concerned" },
      { date: "2026-05-03", summary: "아침 산책 사진 공유", tags: ["산책", "사진"], tone: "warm" },
      { date: "2026-05-02", summary: "등산화가 낡았다고 언급", tags: ["등산", "선물 힌트"], tone: "neutral" },
      { date: "2026-04-26", summary: "산 정상 사진 공유", tags: ["등산", "사진"], tone: "warm" }
    ]
  }
};

const TONE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  warm: { bg: "#E8F3E5", color: "#3A6B3A", label: "😊" },
  neutral: { bg: "#FBF6F0", color: "#8A6B5C", label: "😐" },
  concerned: { bg: "#FFE5DA", color: "#8A3E25", label: "😟" }
};

function calculateGranularityTrend(checkIns: typeof mockCheckIns) {
  const recent = checkIns.filter((ci) => ci.detailedEmotion);
  const total = checkIns.length;
  if (total === 0) return { ratio: 0, label: "감정 기록이 없어요", trend: "neutral" as const };
  const ratio = recent.length / total;
  if (ratio >= 0.6) return { ratio, label: "감정 표현이 풍부해지고 있어요", trend: "up" as const };
  if (ratio >= 0.3) return { ratio, label: "감정을 조금씩 표현하고 있어요", trend: "neutral" as const };
  return { ratio, label: "감정 표현이 아직 적어요", trend: "down" as const };
}

export default function CareSummaryPage() {
  const { selectedParentId, parentProfile } = useSelectedParent();
  const data = PARENT_DATA[selectedParentId] ?? PARENT_DATA.parent_mother;
  const maxCount = Math.max(...data.keywords.map((k) => k.count));
  const granularity = calculateGranularityTrend(mockCheckIns);
  const [consent, setConsent] = useState<ConsentSettings>({ healthShare: true, moodShare: true, memoShare: false, activityShare: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("parentConsent");
      if (saved) setConsent(JSON.parse(saved));
    } catch {}
  }, []);

  return (
    <DetailScreen title="근황 상세" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 키워드 트렌드 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>
          자주 나온 키워드
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {data.keywords.sort((a, b) => b.count - a.count).map((kw) => (
            <div key={kw.word}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "#3D2419", fontWeight: 500 }}>{kw.word}</span>
                <span style={{ fontSize: "12px", color: "#B07A5C" }}>{kw.count}회</span>
              </div>
              <div style={{ height: "6px", background: "#F0E4D8", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(kw.count / maxCount) * 100}%`,
                    background: kw.color,
                    borderRadius: "999px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 패턴 분석 */}
      <div
        style={{
          background: "#E8F3E5",
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#3A6B3A", margin: "0 0 6px", fontWeight: 500 }}>패턴 분석</p>
        <p style={{ fontSize: "14px", color: "#1F4A1F", margin: 0, lineHeight: 1.5 }}>{data.pattern}</p>
      </div>

      {/* 감정 흐름 (동의 기반) */}
      {consent.moodShare && (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            marginBottom: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          <WeeklyEmotionFlow checkIns={mockCheckIns} label="최근 2주 기분 흐름" />
          <EmotionSignalTags checkIns={mockCheckIns} maxTags={6} />

          {/* 감정 세분화 트렌드 */}
          <div>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>감정 세분화 트렌드</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "6px", background: "#F0E4D8", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round(granularity.ratio * 100)}%`,
                    background: granularity.trend === "up" ? "#7AB87A" : granularity.trend === "down" ? "#E07856" : "#E8A04E",
                    borderRadius: "999px",
                    transition: "width 0.5s"
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "#3D2419", whiteSpace: "nowrap", fontWeight: 500 }}>
                {granularity.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 대화 타임라인 */}
      <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>
        대화 기반 타임라인
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.memos.map((memo) => {
          const ts = TONE_STYLE[memo.tone];
          const [, mm, dd] = memo.date.split("-");
          const emotionAnalysis = analyzeEmotionMock({
            messageText: memo.summary,
            senderRole: "parent",
            receiverRole: "child",
          });
          const topSignals = emotionAnalysis.possibleSignals
            .filter((s) => s.likelihood !== "low")
            .slice(0, 2);
          return (
            <div
              key={memo.date + memo.summary}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "14px",
                boxShadow: "0 2px 8px rgba(61,36,25,0.04)",
                display: "flex",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "36px", flexShrink: 0 }}>
                <span style={{ fontSize: "10px", color: "#B07A5C", fontWeight: 500 }}>{parseInt(mm)}월</span>
                <span style={{ fontSize: "16px", color: "#3D2419", fontWeight: 600 }}>{parseInt(dd)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 6px", lineHeight: 1.45 }}>{memo.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {memo.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "11px",
                        background: ts.bg,
                        color: ts.color,
                        borderRadius: "999px",
                        padding: "2px 8px"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {topSignals.map((sig) => (
                    <span
                      key={sig.emotion}
                      style={{
                        fontSize: "11px",
                        background: "#FFF1E6",
                        color: "#C05A2A",
                        border: "1px solid #F5C8A0",
                        borderRadius: "999px",
                        padding: "2px 8px"
                      }}
                    >
                      ~{sig.emotion}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{ts.label}</span>
            </div>
          );
        })}
      </div>
    </DetailScreen>
  );
}
