"use client";

import { EMOTION_TAXONOMY } from "@/lib/emotion/emotionTaxonomy";
import { STRATEGY_LABELS } from "@/lib/types";
import type { EmotionContextAnalysisResult } from "@/lib/types";

interface EmotionContextCardProps {
  analysis: EmotionContextAnalysisResult;
  parentName: string;
  originalMessage: string;
}

const LIKELIHOOD_STYLES = {
  high:   { dot: "#F5A623", label: "가능성 높음",  bg: "#FFF8EE", border: "#F5DFA0" },
  medium: { dot: "#5B9BD5", label: "가능성 중간",  bg: "#EFF6FF", border: "#AECEF5" },
  low:    { dot: "#BBBBBB", label: "가능성 낮음",  bg: "#F7F7F7", border: "#E0E0E0" },
};

const IMPACT_LABELS: Record<string, string> = {
  high: "영향 높음",
  medium: "영향 중간",
  low: "영향 낮음",
};

const SOURCE_LABELS: Record<string, string> = {
  message: "메시지",
  pattern: "패턴",
  rhythm: "연락 리듬",
  profile: "체크인",
};

const CONFIDENCE_STYLES = {
  low:    { label: "참고용 분석",   color: "#888" },
  medium: { label: "보통 신뢰도",   color: "#5B9BD5" },
  high:   { label: "비교적 뚜렷",   color: "#3A8A3A" },
};

function LikelihoodDot({ level }: { level: "low" | "medium" | "high" }) {
  const s = LIKELIHOOD_STYLES[level];
  return (
    <span
      style={{
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: s.dot,
        flexShrink: 0,
        marginTop: "2px",
      }}
    />
  );
}

export function EmotionContextCard({
  analysis,
  parentName,
  originalMessage,
}: EmotionContextCardProps) {
  const strategyInfo = STRATEGY_LABELS[analysis.recommendedStrategy.style];
  const confStyle = CONFIDENCE_STYLES[analysis.confidence];

  return (
    <div
      style={{
        background: "#FFFDF9",
        border: "1.5px solid #F0E4D8",
        borderRadius: "18px",
        padding: "18px 18px 16px",
        marginBottom: "20px",
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#5F4534", margin: 0 }}>
          {parentName}의 마음 읽기
        </p>
        <span style={{ fontSize: "11px", color: confStyle.color, fontWeight: 500 }}>
          {confStyle.label}
        </span>
      </div>

      {/* 원본 메시지 */}
      <div
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid #F0E4D8",
          borderRadius: "10px",
          padding: "10px 14px",
          marginBottom: "14px",
        }}
      >
        <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
          &ldquo;{originalMessage}&rdquo;
        </p>
      </div>

      {/* 표면적 의미 */}
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.5 }}>
        {analysis.surfaceMeaning}
      </p>

      {/* 가능한 정서 신호 */}
      {analysis.possibleSignals.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px", fontWeight: 600 }}>
            이런 마음일 수 있어요
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {analysis.possibleSignals.map((signal, idx) => {
              const emotion = EMOTION_TAXONOMY[signal.emotion];
              const s = LIKELIHOOD_STYLES[signal.likelihood];
              return (
                <div
                  key={idx}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: "10px",
                    padding: "10px 12px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <LikelihoodDot level={signal.likelihood} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#3D2419" }}>
                        {emotion?.ko ?? signal.emotion}
                      </span>
                      <span style={{ fontSize: "11px", color: "#888" }}>
                        — {s.label}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#5F4534", margin: 0, lineHeight: 1.5 }}>
                      {signal.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 참고한 맥락 요인 */}
      {analysis.contextFactors.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 6px", fontWeight: 600 }}>
            참고한 맥락
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {analysis.contextFactors.map((factor, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "1px" }}>•</span>
                <p style={{ fontSize: "12px", color: "#8A8A8A", margin: 0, lineHeight: 1.4 }}>
                  {factor.factor}
                  <span style={{ color: "#BBBBBB", marginLeft: "4px" }}>
                    ({SOURCE_LABELS[factor.source] ?? factor.source} · {IMPACT_LABELS[factor.impact]})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 주의사항 */}
      <div
        style={{
          background: "#F7F5F2",
          borderRadius: "8px",
          padding: "8px 12px",
          marginBottom: "12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A8A8A", margin: 0, lineHeight: 1.5 }}>
          {analysis.caution}
        </p>
      </div>

      {/* 추천 전략 */}
      {strategyInfo && (
        <div
          style={{
            background: "#FFF1E6",
            border: "1px solid #F5C8A0",
            borderRadius: "10px",
            padding: "10px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "15px" }}>{strategyInfo.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#C05A2A" }}>
              {strategyInfo.ko}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#7A4020", margin: 0, lineHeight: 1.5 }}>
            {analysis.recommendedStrategy.reason}
          </p>
        </div>
      )}
    </div>
  );
}
