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
  high:   { dot: "#6E4A39", label: "가능성 높음",  bg: "#F1D6CC", border: "transparent" },
  medium: { dot: "#8A6B5C", label: "가능성 중간",  bg: "#D9D0E5", border: "transparent" },
  low:    { dot: "#9A8B7D", label: "가능성 낮음",  bg: "#F0E7D7", border: "transparent" },
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
  low:    { label: "참고용 분석",   color: "#9A8B7D" },
  medium: { label: "보통 신뢰도",   color: "#8A6B5C" },
  high:   { label: "비교적 뚜렷",   color: "#6E4A39" },
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
        background: "#FFFBF2",
        border: "1px solid #E8DECF",
        borderRadius: "26px",
        padding: "18px 18px 16px",
        marginBottom: "20px",
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3D332C", margin: 0 }}>
          {parentName}의 메시지 맥락
        </p>
        <span style={{ fontSize: "11px", color: confStyle.color, fontWeight: 500 }}>
          {confStyle.label}
        </span>
      </div>

      {/* 원본 메시지 */}
      <div
        style={{
          background: "#FAF6EE",
          border: "1px solid #E8DECF",
          borderRadius: "14px",
          padding: "10px 14px",
          marginBottom: "14px",
        }}
      >
        <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
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
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 600 }}>
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
                    borderRadius: "14px",
                    padding: "10px 12px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <LikelihoodDot level={signal.likelihood} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#241E1A" }}>
                        {emotion?.ko ?? signal.emotion}
                      </span>
                      <span style={{ fontSize: "11px", color: "#8A6B5C" }}>
                        — {s.label}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
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
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 6px", fontWeight: 600 }}>
            참고한 맥락
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {analysis.contextFactors.map((factor, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#9A8B7D", marginTop: "1px" }}>•</span>
                <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
                  {factor.factor}
                  <span style={{ color: "#9A8B7D", marginLeft: "4px" }}>
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
          background: "#F0E7D7",
          borderRadius: "12px",
          padding: "8px 12px",
          marginBottom: "12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {analysis.caution}
        </p>
      </div>

      {/* 추천 전략 */}
      {strategyInfo && (
        <div
          style={{
            background: "#D8E0A6",
            borderRadius: "14px",
            padding: "10px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "15px" }}>{strategyInfo.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#241E1A" }}>
              {strategyInfo.ko}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
            {analysis.recommendedStrategy.reason}
          </p>
        </div>
      )}
    </div>
  );
}
