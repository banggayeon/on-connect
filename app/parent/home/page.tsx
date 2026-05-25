"use client";

import { useState } from "react";
import { AppScreen } from "@/components/AppScreen";
import { parentHome } from "@/lib/mockData";

export default function ParentHomePage() {
  const [sentMessage, setSentMessage] = useState("");

  const buttonStyle = {
    primary: {
      background: "linear-gradient(135deg, #FF8A65, #E07856)",
      color: "white",
      boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
    },
    coralSoft: {
      background: "#FFE5DA",
      color: "#8A3E25",
      boxShadow: "none"
    },
    honey: {
      background: "#FFF1DA",
      color: "#7A5A1A",
      boxShadow: "none"
    }
  } as const;

  return (
    <AppScreen>
      <div
        style={{
          background: "linear-gradient(180deg, #FFEDE0 0%, #FFF8F0 55%, #FFFFFF 100%)",
          minHeight: "100vh",
          padding: "30px 24px 40px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "16px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>
            {parentHome.screen.eyebrow}
          </p>
          <p style={{ fontSize: "34px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.25 }}>
            {parentHome.screen.titleLine1}
            <br />
            {parentHome.screen.titleLine2}
          </p>
        </div>

        {/* 안부 보내기 카드 */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 2px 12px rgba(61,36,25,0.06)",
            marginBottom: "16px"
          }}
        >
          <p style={{ fontSize: "20px", color: "#B07A5C", margin: "0 0 20px", fontWeight: 500 }}>
            {parentHome.mainCardTitle}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {parentHome.largeButtons.map((button) => {
              const s = buttonStyle[button.variant as keyof typeof buttonStyle] ?? buttonStyle.coralSoft;
              return (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setSentMessage(parentHome.sentStatusMessage)}
                  style={{
                    background: s.background,
                    color: s.color,
                    boxShadow: s.boxShadow,
                    border: "none",
                    borderRadius: "20px",
                    padding: "20px",
                    fontSize: "22px",
                    fontWeight: 500,
                    cursor: "pointer",
                    textAlign: "center",
                    width: "100%"
                  }}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* 보냄 확인 메시지 */}
        {sentMessage ? (
          <div
            style={{
              background: "#FFE5DA",
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "16px",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "18px", color: "#8A3E25", margin: 0, fontWeight: 500 }}>{sentMessage}</p>
          </div>
        ) : null}

        {/* 최근 답장 */}
        <div
          style={{
            background: "#E8F3E5",
            borderRadius: "22px",
            padding: "22px",
            marginBottom: "20px"
          }}
        >
          <p style={{ fontSize: "16px", color: "#3A6B3A", margin: "0 0 10px", fontWeight: 500 }}>
            {parentHome.recentReply.title}
          </p>
          <p style={{ fontSize: "20px", color: "#1F4A1F", margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
            {parentHome.recentReply.message}
          </p>
        </div>

        {/* 설정 버튼들 */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {parentHome.footerButtons.map((button) => (
            <button
              key={button.id}
              type="button"
              style={{
                background: "white",
                border: "1px solid #F0E4D8",
                borderRadius: "18px",
                padding: "18px",
                fontSize: "18px",
                color: "#3D2419",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "center",
                width: "100%"
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </AppScreen>
  );
}
