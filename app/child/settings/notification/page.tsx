"use client";

import { useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";

type NotifItem = {
  id: string;
  label: string;
  desc: string;
  detail: string;
  enabled: boolean;
  accentColor: string;
};

const FREQUENCY_OPTIONS = ["매일", "3일마다", "주 1회"];
const TIME_OPTIONS = ["오후 6시", "오후 7시", "오후 8시", "오후 9시"];

export default function NotificationPage() {
  const [items, setItems] = useState<NotifItem[]>([
    { id: "nudge", label: "넛지 알림", desc: "마지막 연락 후 안부 리마인더", detail: "매일", enabled: true, accentColor: "#E07856" },
    { id: "question", label: "오늘의 질문 알림", desc: "새 질문이 도착하면 알림", detail: "오후 7시", enabled: true, accentColor: "#E8A04E" },
    { id: "parent_signal", label: "부모님 안부 수신", desc: "부모님이 안부를 남기면 알림", detail: "즉시", enabled: true, accentColor: "#7AB87A" }
  ]);
  const [nudgeFreq, setNudgeFreq] = useState("매일");
  const [questionTime, setQuestionTime] = useState("오후 7시");

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, enabled: !it.enabled } : it));
  }

  return (
    <DetailScreen title="알림 설정" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 알림 토글 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "6px 4px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        {items.map((item, i, arr) => (
          <div
            key={item.id}
            style={{
              padding: "14px",
              borderBottom: i < arr.length - 1 ? "1px solid #F5EDE6" : "none",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ fontSize: "12px", color: "#B07A5C", marginRight: "6px" }}>{item.detail}</span>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "999px",
                background: item.enabled ? item.accentColor : "#D9CEC6",
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
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>넛지 알림 빈도</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setNudgeFreq(opt)}
              style={{
                flex: 1,
                background: nudgeFreq === opt ? "linear-gradient(135deg, #FF8A65, #E07856)" : "#FBF6F0",
                color: nudgeFreq === opt ? "white" : "#8A6B5C",
                border: "none",
                borderRadius: "12px",
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
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>오늘의 질문 알림 시간</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setQuestionTime(opt)}
              style={{
                background: questionTime === opt ? "#FFF1DA" : "#FBF6F0",
                color: questionTime === opt ? "#7A5A1A" : "#8A6B5C",
                border: questionTime === opt ? "2px solid #E8A04E" : "1.5px solid transparent",
                borderRadius: "12px",
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
          background: "linear-gradient(135deg, #FF8A65, #E07856)",
          color: "white",
          border: "none",
          borderRadius: "16px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
        }}
      >
        설정 저장
      </button>
    </DetailScreen>
  );
}
