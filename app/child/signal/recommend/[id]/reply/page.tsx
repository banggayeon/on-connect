"use client";

import { use, useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { EmotionContextCard } from "@/components/child/EmotionContextCard";
import { EMOTION_TAXONOMY } from "@/lib/emotion/emotionTaxonomy";
import { careMessages } from "@/lib/mockData";
import type { EmotionContextAnalysisResult, WarmReplyOption } from "@/lib/types";

type FlowStep = "input" | "analyzing" | "result" | "sent";

const EXPRESSION_LEVEL_STYLES: Record<string, { label: string; dots: [boolean, boolean, boolean]; color: string }> = {
  minimal:  { label: "간단한 표현", dots: [true,  false, false], color: "#9A8B7D" },
  moderate: { label: "적당한 표현", dots: [true,  true,  false], color: "#8A6B5C" },
  rich:     { label: "풍부한 표현", dots: [true,  true,  true],  color: "#241E1A" },
};

const CAT_CONFIG = {
  under: {
    label: "조금 무심하게 들릴 수 있어요",
    description: "답장이 너무 짧거나 건조하면 부모님이 서운하게 느낄 수 있어요.",
    suggestion: "한 문장만 더 붙여 마음을 보여주세요.",
    bg: "#F1D6CC",
  },
  appropriate: {
    label: "받아들이기 좋은 표현이에요",
    description: "부담스럽지 않으면서도 마음이 잘 전해져요.",
    suggestion: "이 톤을 유지해도 좋아요.",
    bg: "#CDDCC8",
  },
  over: {
    label: "걱정이 과하게 들릴 수 있어요",
    description: "너무 길거나 걱정이 강하면 부모님이 부담을 느낄 수 있어요.",
    suggestion: "짧고 편안한 표현으로 줄여보세요.",
    bg: "#D9D0E5",
  },
} as const;

function ExpressionDots({ level }: { level: string }) {
  const s = EXPRESSION_LEVEL_STYLES[level] ?? EXPRESSION_LEVEL_STYLES.moderate;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {s.dots.map((filled, i) => (
        <span
          key={i}
          style={{
            display: "inline-block", width: "8px", height: "8px",
            borderRadius: "50%", background: filled ? s.color : "#E8DECF",
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
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: "#F6D6BD", color: "#3D332C", fontWeight: 500 }}>
      {emotion.ko}
    </span>
  );
}

function CATCard({ level }: { level: "under" | "appropriate" | "over" }) {
  const c = CAT_CONFIG[level];
  return (
    <div style={{ background: c.bg, borderRadius: "20px", padding: "16px 18px", marginBottom: "16px" }}>
      <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 6px", fontWeight: 600 }}>표현 조정 포인트</p>
      <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 6px", fontWeight: 600, lineHeight: 1.35 }}>
        {c.label}
      </p>
      <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 8px", lineHeight: 1.5 }}>
        {c.description}
      </p>
      <p style={{ fontSize: "12.5px", color: "#6E4A39", margin: 0, fontWeight: 500 }}>
        → {c.suggestion}
      </p>
    </div>
  );
}

function ReplyCard({ reply, selected, onSelect }: { reply: WarmReplyOption; selected: boolean; onSelect: () => void }) {
  const toneLabels: Record<string, string> = { warm: "따뜻하게", casual: "가볍게", formal: "격식 있게" };
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        background: selected ? "#F1E5C8" : "#FFFBF2",
        border: selected ? "2px solid #6E4A39" : "1px solid #E8DECF",
        borderRadius: "22px",
        padding: selected ? "15px" : "16px",
        textAlign: "left", cursor: "pointer", width: "100%",
        transition: "all 0.12s",
      }}
    >
      <span style={{
        fontSize: "11px", fontWeight: 600,
        color: selected ? "#6E4A39" : "#8A6B5C",
        background: selected ? "rgba(110,74,57,0.1)" : "#F0E7D7",
        padding: "3px 10px", borderRadius: "999px",
        display: "inline-block", marginBottom: "10px",
      }}>
        {toneLabels[reply.tone] ?? reply.tone}
      </span>
      <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 12px", lineHeight: 1.5, fontWeight: selected ? 500 : 400 }}>
        &ldquo;{reply.text}&rdquo;
      </p>
      <div style={{ marginBottom: "8px" }}>
        <ExpressionDots level={reply.expressionLevel} />
      </div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        {reply.emotionExpressed.map((eid) => <EmotionTag key={eid} emotionId={eid} />)}
      </div>
      <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>{reply.reason}</p>
    </button>
  );
}

export default function WarmReplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isFather = id.includes("father") || id.includes("dad");
  const parentName = isFather ? "아빠" : "엄마";
  const sampleMessage = isFather
    ? careMessages.fatherWarmReplyAI.incomingMessage
    : careMessages.warmReplyAI.incomingMessage;

  const [step, setStep] = useState<FlowStep>("input");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<EmotionContextAnalysisResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  async function handleAnalyze() {
    if (!inputText.trim()) return;
    setStep("analyzing");
    try {
      const res = await fetch("/api/ai/warm-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawMessage: inputText.trim(),
          senderName: parentName,
          parentId: isFather ? "parent_father" : "parent_mother",
        }),
      });
      const result: EmotionContextAnalysisResult = await res.json();
      if (result.possibleSignals && result.suggestedReplies) {
        setData(result);
      }
    } catch (e) {
      console.error("맥락 분석 실패:", e);
    } finally {
      setStep("result");
    }
  }

  const accommodationLevel = (data?._internal?.accommodationLevel ?? "appropriate") as "under" | "appropriate" | "over";
  const selectedText = selected !== null ? data?.suggestedReplies[selected]?.text : null;

  return (
    <DetailScreen title="답장 맥락 살펴보기">

      {/* Step 1: 메시지 입력 */}
      {step === "input" && (
        <>
          <div style={{ background: "#FFFBF2", borderRadius: "22px", padding: "20px", border: "1px solid #E8DECF", marginBottom: "14px" }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#241E1A", margin: "0 0 4px" }}>
              {parentName}이 보낸 메시지
            </p>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.5 }}>
              자동으로 메시지를 가져오지 않아요.<br/>사용자가 선택한 문장만 분석해요.
            </p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${parentName}이 보낸 메시지를 붙여넣어 주세요.`}
              style={{
                width: "100%", minHeight: "110px",
                fontSize: "15px", lineHeight: 1.6,
                border: "1px solid #E8DECF", borderRadius: "16px",
                padding: "14px", resize: "none", outline: "none",
                boxSizing: "border-box", fontFamily: "inherit",
                color: "#241E1A", background: "#FAF6EE",
              }}
            />
            <button
              type="button"
              onClick={() => setInputText(sampleMessage)}
              style={{
                marginTop: "10px", background: "none", border: "none",
                fontSize: "12.5px", color: "#8A6B5C", cursor: "pointer",
                padding: "0", textDecoration: "underline",
              }}
            >
              예시 문장 넣어보기
            </button>
          </div>

          <div style={{ background: "#F6D6BD", borderRadius: "16px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", color: "#6E4A39", margin: 0, lineHeight: 1.55 }}>
              AI가 단정하지 않고 가능성으로 안내해요. 말 속에 담긴 맥락을 함께 살펴봐요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            style={{
              width: "100%",
              background: inputText.trim() ? "#241E1A" : "#D5CFC8",
              color: inputText.trim() ? "#FBF6EC" : "#9A8B7D",
              border: "none", borderRadius: "999px",
              padding: "17px", fontSize: "16px", fontWeight: 600,
              cursor: inputText.trim() ? "pointer" : "not-allowed",
            }}
          >
            맥락 살펴보기
          </button>
        </>
      )}

      {/* Step 2: 분석 중 */}
      {step === "analyzing" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #E8DECF", borderTopColor: "#241E1A", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 6px" }}>말 속에 담긴 맥락을 살펴보고 있어요</p>
          <p style={{ fontSize: "12px", color: "#9A8B7D", margin: 0 }}>잠깐만요...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Step 3: 분석 결과 + 답장 추천 */}
      {step === "result" && (
        <>
          <div style={{ background: "#FAF6EE", borderRadius: "16px", padding: "12px 16px", marginBottom: "16px", border: "1px solid #E8DECF" }}>
            <p style={{ fontSize: "11px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>{parentName}이 보낸 메시지</p>
            <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
              &ldquo;{inputText.trim()}&rdquo;
            </p>
          </div>

          {data ? (
            <>
              <EmotionContextCard analysis={data} parentName={parentName} originalMessage={inputText.trim()} />
              <CATCard level={accommodationLevel} />

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
                부모님이 받아들이기 쉬운 말투로 다듬어봤어요
              </p>
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
                    background: selected === idx ? "#F1E5C8" : "#FFFBF2",
                    border: selected === idx ? "2px solid #6E4A39" : "1px solid #E8DECF",
                    borderRadius: "22px", padding: selected === idx ? "13px 15px" : "14px 16px",
                    textAlign: "left", cursor: "pointer", width: "100%", marginBottom: "8px",
                  }}
                >
                  <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 6px" }}>&ldquo;{r.text}&rdquo;</p>
                  <span style={{ fontSize: "11px", color: "#8A6B5C", background: "#F0E7D7", borderRadius: "999px", padding: "3px 10px" }}>
                    {r.tag}
                  </span>
                </button>
              ))}
            </>
          )}

          <button
            type="button"
            onClick={() => { if (selected !== null) setStep("sent"); }}
            style={{
              width: "100%",
              background: selected !== null ? "#241E1A" : "#D5CFC8",
              color: selected !== null ? "#FBF6EC" : "#9A8B7D",
              border: "none", borderRadius: "999px",
              padding: "16px", fontSize: "16px", fontWeight: 600,
              cursor: selected !== null ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {selected !== null ? "↑ 이 답장 보내기" : "답장을 선택해주세요"}
          </button>
        </>
      )}

      {/* Step 4: 전송 완료 */}
      {step === "sent" && (
        <div style={{ background: "#CDDCC8", borderRadius: "999px", padding: "16px 18px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>답장을 보냈어요</p>
          <p style={{ fontSize: "13px", color: "#3D332C", margin: 0 }}>&ldquo;{selectedText}&rdquo;</p>
        </div>
      )}
    </DetailScreen>
  );
}
