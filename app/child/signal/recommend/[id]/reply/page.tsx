"use client";

import { use, useState, useEffect } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { EmotionContextCard } from "@/components/child/EmotionContextCard";
import { EMOTION_TAXONOMY } from "@/lib/emotion/emotionTaxonomy";
import { careMessages } from "@/lib/mockData";
import type { EmotionContextAnalysisResult, WarmReplyOption } from "@/lib/types";

const EXPRESSION_LEVEL_STYLES: Record<string, { label: string; dots: [boolean, boolean, boolean]; color: string }> = {
  minimal:  { label: "간단한 표현", dots: [true,  false, false], color: "#9A8B7D" },
  moderate: { label: "적당한 표현", dots: [true,  true,  false], color: "#8A6B5C" },
  rich:     { label: "풍부한 표현", dots: [true,  true,  true],  color: "#241E1A" },
};

function ExpressionDots({ level }: { level: string }) {
  const s = EXPRESSION_LEVEL_STYLES[level] ?? EXPRESSION_LEVEL_STYLES.moderate;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {s.dots.map((filled, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: filled ? s.color : "#E8DECF",
          }}
        />
      ))}
      <span style={{ fontSize: "11px", color: "#8A6B5C", marginLeft: "4px" }}>{s.label}</span>
    </div>
  );
}

function EmotionTag({ emotionId }: { emotionId: string }) {
  const emotion = EMOTION_TAXONOMY[emotionId];
  if (!emotion) return null;
  return (
    <span
      style={{
        fontSize: "11px",
        padding: "2px 8px",
        borderRadius: "999px",
        background: "#F6D6BD",
        color: "#3D332C",
        fontWeight: 500,
      }}
    >
      {emotion.ko}
    </span>
  );
}

function ReplyCard({ reply, selected, onSelect }: { reply: WarmReplyOption; selected: boolean; onSelect: () => void }) {
  const toneLabels: Record<string, string> = {
    warm: "따뜻하게",
    casual: "가볍게",
    formal: "격식 있게",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        background: selected ? "#241E1A" : "#FFFBF2",
        border: "none",
        borderRadius: "22px",
        padding: "16px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.15s",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: selected ? "#FBF6EC" : "#8A6B5C",
          background: selected ? "rgba(255,255,255,0.2)" : "#F0E7D7",
          padding: "3px 10px",
          borderRadius: "999px",
          display: "inline-block",
          marginBottom: "10px",
        }}
      >
        {toneLabels[reply.tone] ?? reply.tone}
      </span>

      <p
        style={{
          fontSize: "15px",
          color: selected ? "#FBF6EC" : "#241E1A",
          margin: "0 0 12px",
          lineHeight: 1.5,
          fontWeight: selected ? 500 : 400,
        }}
      >
        &ldquo;{reply.text}&rdquo;
      </p>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: selected ? "rgba(251,246,236,0.7)" : "#8A6B5C" }}>마음 전달</span>
          <ExpressionDots level={reply.expressionLevel} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        {reply.emotionExpressed.map((eid) => (
          <EmotionTag key={eid} emotionId={eid} />
        ))}
      </div>

      <p style={{ fontSize: "12px", color: selected ? "rgba(251,246,236,0.7)" : "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
        {reply.reason}
      </p>
    </button>
  );
}

function LoadingState() {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #E8DECF", borderTopColor: "#241E1A", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
      <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0 }}>마음을 읽고 있어요...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function WarmReplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<EmotionContextAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  const isFather = id.includes("father") || id.includes("dad");
  const parentName = isFather ? "아빠" : "엄마";
  const incomingMessage = isFather
    ? careMessages.fatherWarmReplyAI.incomingMessage
    : careMessages.warmReplyAI.incomingMessage;
  const senderName = isFather ? "아빠" : "엄마";

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch("/api/ai/warm-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawMessage: incomingMessage,
            senderName,
            parentId: isFather ? "parent_father" : "parent_mother",
          }),
        });
        const result: EmotionContextAnalysisResult = await res.json();
        if (result.possibleSignals && result.suggestedReplies) {
          setData(result);
        }
      } catch (e) {
        console.error("warm-reply 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [incomingMessage, senderName, isFather]);

  const selectedText = selected !== null ? data?.suggestedReplies[selected]?.text : null;

  return (
    <DetailScreen title="답장 추천">
      {loading ? (
        <LoadingState />
      ) : data ? (
        <>
          <EmotionContextCard
            analysis={data}
            parentName={parentName}
            originalMessage={incomingMessage}
          />

          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 600 }}>
            이렇게 답해보는 건 어때요?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            {data.suggestedReplies.map((reply, idx) => (
              <ReplyCard
                key={idx}
                reply={reply}
                selected={selected === idx}
                onSelect={() => setSelected(selected === idx ? null : idx)}
              />
            ))}
          </div>

          <p style={{ fontSize: "12px", color: "#9A8B7D", textAlign: "center", margin: "0 0 16px", lineHeight: 1.5 }}>
            마음 전달이 풍부할수록 감정이 더 잘 전달돼요
          </p>

          {!sent ? (
            <button
              type="button"
              onClick={() => { if (selected !== null) setSent(true); }}
              style={{
                width: "100%",
                background: selected !== null ? "#241E1A" : "#D5CFC8",
                color: selected !== null ? "#FBF6EC" : "#9A8B7D",
                border: "none",
                borderRadius: "999px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: selected !== null ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {selected !== null ? "↑ 이 답장 보내기" : "답장을 선택해주세요"}
            </button>
          ) : (
            <div style={{ background: "#CDDCC8", borderRadius: "999px", padding: "16px 18px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>
                답장을 보냈어요
              </p>
              <p style={{ fontSize: "13px", color: "#3D332C", margin: 0 }}>
                &ldquo;{selectedText}&rdquo;
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 600 }}>
            이렇게 이어가보세요
          </p>
          {[
            { text: "잘 먹었어요. 엄마도 식사 따뜻하게 챙겨 드세요.", tag: "다정하게" },
            { text: "고마워요, 엄마. 요즘 잘 지내고 계세요?", tag: "가볍게" },
            { text: "네, 잘 챙겼어요. 엄마 허리는 좀 괜찮으세요?", tag: "걱정하며" },
          ].map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(selected === idx ? null : idx)}
              style={{
                background: selected === idx ? "#241E1A" : "#FFFBF2",
                border: "none",
                borderRadius: "22px",
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
                marginBottom: "8px",
              }}
            >
              <p style={{ fontSize: "15px", color: selected === idx ? "#FBF6EC" : "#241E1A", margin: "0 0 6px" }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <span
                style={{
                  fontSize: "11px",
                  color: selected === idx ? "#FBF6EC" : "#8A6B5C",
                  background: selected === idx ? "rgba(255,255,255,0.2)" : "#F0E7D7",
                  borderRadius: "999px",
                  padding: "3px 10px",
                }}
              >
                {r.tag}
              </span>
            </button>
          ))}
        </>
      )}
    </DetailScreen>
  );
}
