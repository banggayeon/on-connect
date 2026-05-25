"use client";

import { useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";

type NotifItem = {
  id: string;
  label: string;
  desc: string;
  detail: string;
  enabled: boolean;
};

const FREQUENCY_OPTIONS = ["매일", "3일마다", "주 1회"];
const TIME_OPTIONS = ["오후 6시", "오후 7시", "오후 8시", "오후 9시"];

export default function NotificationPage() {
  const [items, setItems] = useState<NotifItem[]>([
    { id: "nudge", label: "넛지 알림", desc: "마지막 연락 후 안부 리마인더", detail: "매일", enabled: true },
    { id: "question", label: "오늘의 질문 알림", desc: "새 질문이 도착하면 알림", detail: "오후 7시", enabled: true },
    { id: "parent_signal", label: "부모님 안부 수신", desc: "부모님이 안부를 남기면 알림", detail: "즉시", enabled: true }
  ]);
  const [nudgeFreq, setNudgeFreq] = useState("매일");
  const [questionTime, setQuestionTime] = useState("오후 7시");

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, enabled: !it.enabled } : it));
  }

  return (
    <DetailScreen title="알림 설정">
      {/* 알림 토글 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "6px 4px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        {items.map((item, i, arr) => (
          <div
            key={item.id}
            style={{
              padding: "14px",
              borderBottom: i < arr.length - 1 ? "1px solid #F0E7D7" : "none",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 2px", fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ fontSize: "12px", color: "#8A6B5C", marginRight: "6px" }}>{item.detail}</span>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "999px",
                background: item.enabled ? "#241E1A" : "#D5CFC8",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                position: "relative",
                transition: "background 0.2s"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: item.enabled ? "23px" : "3px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s"
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 넛지 빈도 설정 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>넛지 알림 빈도</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setNudgeFreq(opt)}
              style={{
                flex: 1,
                background: nudgeFreq === opt ? "#241E1A" : "#F0E7D7",
                color: nudgeFreq === opt ? "#FBF6EC" : "#3D332C",
                border: "none",
                borderRadius: "999px",
                padding: "10px 8px",
                fontSize: "13px",
                fontWeight: nudgeFreq === opt ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 질문 알림 시간 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>오늘의 질문 알림 시간</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setQuestionTime(opt)}
              style={{
                background: questionTime === opt ? "#241E1A" : "#F0E7D7",
                color: questionTime === opt ? "#FBF6EC" : "#3D332C",
                border: "none",
                borderRadius: "999px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: questionTime === opt ? 600 : 400,
                cursor: "pointer"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 저장 */}
      <button
        type="button"
        style={{
          width: "100%",
          background: "#241E1A",
          color: "#FBF6EC",
          border: "none",
          borderRadius: "999px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        설정 저장
      </button>
    </DetailScreen>
  );
}
