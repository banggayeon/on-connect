"use client";

import { useState, useEffect } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { logContact, getRecentContact, daysSince as daysSinceFn } from "@/lib/contactLog";
import { demoDataset } from "@/lib/mockData";

type Suggestion = { id: string; text: string; reason: string };

function computeDaysSince(personId: string): number {
  const person = demoDataset.parents.find(p => p.id === personId);
  const records = person?.contactRecords30Days ?? [];

  const latestRecordDate = records.length
    ? records.reduce((a, b) => (a.date > b.date ? a : b)).date
    : null;

  const daysFromRecords = latestRecordDate ? daysSinceFn(latestRecordDate) : 99;
  const logged = getRecentContact(personId);
  const daysFromLog = logged ? daysSinceFn(logged.date) : Infinity;

  return Math.min(daysFromRecords, daysFromLog);
}

export default function FirstContactPage() {
  const { parentProfile, selectedParentId } = useSelectedParent();
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "memo" | "done">("select");
  const [memo, setMemo] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const daysSince = computeDaysSince(selectedParentId);

  const dayLabel =
    daysSince === 0 ? "오늘 연락했어요" :
    daysSince === 1 ? "어제 연락했어요" :
    daysSince >= 99 ? "연락 기록이 없어요" :
    `마지막 연락이 ${daysSince}일 전이에요`;

  useEffect(() => {
    setLoading(true);
    setSuggestions([]);
    setSelectedMsg(null);
    setStep("select");

    fetch("/api/ai/first-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: selectedParentId, daysSince }),
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data.suggestions)) setSuggestions(data.suggestions); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentId]);

  return (
    <DetailScreen title="다시 연락하기">

      {/* ── 안부 현황 ─────────────────────────────────────────────── */}
      <div style={{
        background: "#F6D6BD", borderRadius: "26px",
        padding: "18px 20px", marginBottom: "20px"
      }}>
        <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 4px", fontWeight: 500 }}>
          안부 현황
        </p>
        <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
          {parentProfile.displayName}과 {dayLabel}
        </p>
      </div>

      {/* ── 문장 추천 ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {loading ? (
          <>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  background: "#F0E7D7",
                  borderRadius: "22px",
                  height: "76px",
                  opacity: 0.4 + i * 0.15,
                }}
              />
            ))}
            <p style={{ textAlign: "center", fontSize: "13px", color: "#8A6B5C", margin: "4px 0 0" }}>
              맥락에 맞는 문장을 준비하고 있어요…
            </p>
          </>
        ) : suggestions.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedMsg(selectedMsg === s.text ? null : s.text)}
            style={{
              background: selectedMsg === s.text ? "#241E1A" : "#FFFBF2",
              border: `1px solid ${selectedMsg === s.text ? "transparent" : "#E8DECF"}`,
              borderRadius: "22px",
              padding: "16px 18px",
              textAlign: "left",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <p style={{
              fontSize: "15px",
              color: selectedMsg === s.text ? "#FBF6EC" : "#241E1A",
              margin: "0 0 6px",
              fontWeight: 600,
              lineHeight: 1.45,
            }}>
              &quot;{s.text}&quot;
            </p>
            <p style={{
              fontSize: "12px",
              color: selectedMsg === s.text ? "#C5BFBC" : "#8A6B5C",
              margin: 0,
            }}>
              {s.reason}
            </p>
          </button>
        ))}
      </div>

      {/* ── 복사 / 메모 / 완료 플로우 ─────────────────────────────── */}
      {step === "select" && (
        <button
          type="button"
          onClick={async () => {
            if (!selectedMsg) return;
            try { await navigator.clipboard.writeText(selectedMsg); } catch {}
            setStep("memo");
          }}
          style={{
            width: "100%",
            background: selectedMsg ? "#241E1A" : "#D5CFC8",
            color: selectedMsg ? "#FBF6EC" : "#9A8B7D",
            border: "none", borderRadius: "999px", padding: "16px",
            fontSize: "16px", fontWeight: 600,
            cursor: selectedMsg ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}
        >
          {selectedMsg ? "↑ 이 문장으로 연락하기" : "문장을 선택해주세요"}
        </button>
      )}

      {step === "memo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "#CDDCC8", borderRadius: "18px", padding: "14px 18px" }}>
            <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 2px", fontWeight: 600 }}>
              복사됐어요
            </p>
            <p style={{ fontSize: "13px", color: "#6E4A39", margin: 0 }}>
              카카오톡에 붙여넣기 해서 보내세요.
            </p>
          </div>
          <input
            type="text"
            placeholder="어떤 대화를 시작했나요? (선택)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "999px",
              border: "1px solid #E8DECF", background: "#FFFBF2",
              fontSize: "14px", color: "#241E1A", outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => { logContact(selectedParentId, memo.trim() || undefined); setStep("done"); }}
              style={{
                flex: 1, background: "#241E1A", color: "#FBF6EC",
                border: "none", borderRadius: "999px", padding: "14px",
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
              }}
            >
              기록하기
            </button>
            <button
              type="button"
              onClick={() => { logContact(selectedParentId); setStep("done"); }}
              style={{
                flex: 1, background: "#F0E7D7", color: "#6E4A39",
                border: "none", borderRadius: "999px", padding: "14px",
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
              }}
            >
              건너뛰기
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div style={{
          background: "#CDDCC8", borderRadius: "18px",
          padding: "16px 18px", textAlign: "center"
        }}>
          <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>
            기록했어요 ✓
          </p>
          {memo.trim() && (
            <p style={{ fontSize: "13px", color: "#6E4A39", margin: "4px 0 0" }}>
              &quot;{memo.trim()}&quot;
            </p>
          )}
        </div>
      )}
    </DetailScreen>
  );
}
