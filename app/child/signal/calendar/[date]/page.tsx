"use client";

import { use, useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { mockCalendarEntries } from "@/lib/mockData";

export default function CalendarDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const { selectedParentId, parentProfile } = useSelectedParent();
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [, mm, dd] = date.split("-");
  const dateLabel = `${parseInt(mm)}월 ${parseInt(dd)}일`;

  const dayEntries = mockCalendarEntries.find(
    (e) => e.date === date && e.parentId === selectedParentId
  );
  const hasEntries = !!dayEntries && dayEntries.entries.length > 0;

  function handleSubmit() {
    if (text.trim()) {
      setSubmitted(true);
      setWriting(false);
    }
  }

  return (
    <DetailScreen title={`${dateLabel} 안부`} className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {(hasEntries || submitted) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {dayEntries?.entries.map((entry, i) => {
            const isChild = entry.sender === "child";
            const hhmm = entry.timestamp.split("T")[1]?.slice(0, 5) ?? "";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isChild ? "flex-end" : "flex-start"
                }}
              >
                <p style={{ fontSize: "11px", color: "#B07A5C", margin: "0 0 4px" }}>
                  {isChild ? "나" : parentProfile.displayName} · {hhmm}
                </p>
                <div
                  style={{
                    background: isChild ? "linear-gradient(135deg, #FF8A65, #E07856)" : "white",
                    color: isChild ? "white" : "#3D2419",
                    borderRadius: isChild ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "12px 16px",
                    maxWidth: "80%",
                    boxShadow: isChild
                      ? "0 4px 12px rgba(224,120,86,0.25)"
                      : "0 2px 8px rgba(61,36,25,0.06)",
                    fontSize: "14px",
                    lineHeight: 1.5
                  }}
                >
                  {entry.type === "photo" ? (
                    <div>
                      <div
                        style={{
                          width: "100%",
                          height: "120px",
                          background: "#F0E4D8",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "6px"
                        }}
                      >
                        <ImagePlus size={28} style={{ color: "#B07A5C" }} />
                      </div>
                      <p style={{ margin: 0 }}>{entry.content}</p>
                    </div>
                  ) : (
                    entry.content
                  )}
                </div>
              </div>
            );
          })}
          {submitted && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <p style={{ fontSize: "11px", color: "#B07A5C", margin: "0 0 4px" }}>나 · 방금 전</p>
              <div
                style={{
                  background: "linear-gradient(135deg, #FF8A65, #E07856)",
                  color: "white",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 16px",
                  maxWidth: "80%",
                  boxShadow: "0 4px 12px rgba(224,120,86,0.25)",
                  fontSize: "14px",
                  lineHeight: 1.5
                }}
              >
                {text}
              </div>
            </div>
          )}
          {!writing && !submitted && (
            <button
              type="button"
              onClick={() => setWriting(true)}
              style={{
                marginTop: "8px",
                background: "white",
                border: "1.5px solid #F0E4D8",
                borderRadius: "14px",
                padding: "14px 18px",
                fontSize: "14px",
                color: "#8A6B5C",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Send size={15} /> 안부 남기기
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              background: "#FBF6F0",
              borderRadius: "18px",
              padding: "28px 20px",
              textAlign: "center",
              marginBottom: "14px"
            }}
          >
            <p style={{ fontSize: "15px", color: "#B07A5C", margin: "0 0 6px" }}>
              아직 안부를 남기지 않았어요
            </p>
            <p style={{ fontSize: "13px", color: "#C5A898", margin: 0 }}>
              {parentProfile.displayName}와의 {dateLabel}을 기억해보세요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWriting(true)}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #FF8A65, #E07856)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
            }}
          >
            안부 남기기
          </button>
        </div>
      )}

      {/* 작성 폼 */}
      {writing && (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            marginTop: "14px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>안부 작성</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="오늘 하루는 어땠나요?"
            style={{
              width: "100%",
              minHeight: "90px",
              border: "1.5px solid #F0E4D8",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "14px",
              color: "#3D2419",
              background: "#FBF6F0",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              fontFamily: "inherit",
              boxSizing: "border-box",
              marginBottom: "10px"
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#FBF6F0",
                border: "1px solid #F0E4D8",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#8A6B5C",
                cursor: "pointer"
              }}
            >
              <ImagePlus size={15} /> 사진
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                flex: 1,
                background: text.trim() ? "linear-gradient(135deg, #FF8A65, #E07856)" : "#F0E4D8",
                color: text.trim() ? "white" : "#B07A5C",
                border: "none",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: text.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Send size={14} /> 보내기
            </button>
          </div>
        </div>
      )}
    </DetailScreen>
  );
}
