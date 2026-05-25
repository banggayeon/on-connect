"use client";

import { use, useState } from "react";
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
    <DetailScreen title={`${dateLabel} 안부`}>
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
                <p style={{ fontSize: "11px", color: "#8A6B5C", margin: "0 0 4px" }}>
                  {isChild ? "나" : parentProfile.displayName} · {hhmm}
                </p>
                <div
                  style={{
                    background: isChild ? "#241E1A" : "#FFFBF2",
                    color: isChild ? "#FBF6EC" : "#241E1A",
                    borderRadius: isChild ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "12px 16px",
                    maxWidth: "80%",
                    border: isChild ? "none" : "1px solid #E8DECF",
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
                          background: "#F0E7D7",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "6px"
                        }}
                      >
                        <span style={{ fontSize: "28px" }}>🖼</span>
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
              <p style={{ fontSize: "11px", color: "#8A6B5C", margin: "0 0 4px" }}>나 · 방금 전</p>
              <div
                style={{
                  background: "#241E1A",
                  color: "#FBF6EC",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 16px",
                  maxWidth: "80%",
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
                background: "#FFFBF2",
                border: "1px solid #E8DECF",
                borderRadius: "999px",
                padding: "14px 18px",
                fontSize: "14px",
                color: "#3D332C",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              ↑ 안부 남기기
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              background: "#FAF6EE",
              borderRadius: "26px",
              padding: "28px 20px",
              textAlign: "center",
              marginBottom: "14px"
            }}
          >
            <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 6px" }}>
              아직 안부를 남기지 않았어요
            </p>
            <p style={{ fontSize: "13px", color: "#9A8B7D", margin: 0 }}>
              {parentProfile.displayName}와의 {dateLabel}을 기억해보세요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWriting(true)}
            style={{
              width: "100%",
              background: "#241E1A",
              color: "#FBF6EC",
              border: "none",
              borderRadius: "999px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            안부 남기기
          </button>
        </div>
      )}

      {writing && (
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF",
            marginTop: "14px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>안부 작성</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="오늘 하루는 어땠나요?"
            style={{
              width: "100%",
              minHeight: "90px",
              border: "1px solid #E8DECF",
              borderRadius: "16px",
              padding: "12px 14px",
              fontSize: "14px",
              color: "#241E1A",
              background: "#FAF6EE",
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
                background: "#F0E7D7",
                border: "none",
                borderRadius: "999px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#3D332C",
                cursor: "pointer"
              }}
            >
              📷 사진
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                flex: 1,
                background: text.trim() ? "#241E1A" : "#D5CFC8",
                color: text.trim() ? "#FBF6EC" : "#9A8B7D",
                border: "none",
                borderRadius: "999px",
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
              ↑ 보내기
            </button>
          </div>
        </div>
      )}
    </DetailScreen>
  );
}
