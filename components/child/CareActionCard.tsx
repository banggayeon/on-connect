"use client";

import { useState } from "react";

export type CareActionItem = {
  id: string;
  parentName: string;
  title: string;
  kind: "care-item" | "care-action";
  description: string;
  actionLabel: string;
  evidence: string[];
  reasoning: string;
};

type CareActionCardProps = {
  title?: string;
  description?: string;
  consentNotice: {
    title: string;
    body: string;
  };
  actions: CareActionItem[];
};

function getKindLabel(kind: CareActionItem["kind"]) {
  return kind === "care-item" ? "케어 아이템" : "케어 행동";
}

export function CareActionCard({
  title = "AI 추천 케어 액션",
  description = "선물보다 먼저, 부모님이 부담 없이 받을 수 있는 행동을 함께 제안해요.",
  consentNotice,
  actions
}: CareActionCardProps) {
  const [selectedAction, setSelectedAction] = useState<CareActionItem | null>(null);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)",
        padding: "0 22px 30px"
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
          borderRadius: "22px",
          padding: "18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#8A3E25", margin: "0 0 8px", fontWeight: 500 }}>동의 기반 공유</p>
        <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500, lineHeight: 1.45 }}>{consentNotice.title}</p>
        <p style={{ fontSize: "14px", color: "#5F4534", margin: 0, lineHeight: 1.55 }}>{consentNotice.body}</p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}
      >
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>{title}</p>
        <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 14px", fontWeight: 500, lineHeight: 1.45 }}>{description}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => setSelectedAction(action)}
              style={{
                width: "100%",
                border: "1px solid #F0E4D8",
                background: "#FFF8F0",
                borderRadius: "18px",
                padding: "15px",
                textAlign: "left",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 5px", fontWeight: 500 }}>
                    {action.parentName} · {getKindLabel(action.kind)}
                  </p>
                  <p style={{ fontSize: "16px", color: "#3D2419", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{action.title}</p>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: "12px",
                    color: action.kind === "care-action" ? "#3A6B3A" : "#7A5A1A",
                    background: action.kind === "care-action" ? "#E8F3E5" : "#FFF1DA",
                    borderRadius: "999px",
                    padding: "6px 9px",
                    fontWeight: 500
                  }}
                >
                  AI 추천
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 10px", lineHeight: 1.5 }}>{action.description}</p>
              <div style={{ background: "#E8F3E5", borderRadius: "14px", padding: "11px" }}>
                <p style={{ fontSize: "13px", color: "#1F4A1F", margin: 0, lineHeight: 1.45 }}>{action.actionLabel}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAction ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedAction(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,36,32,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 30
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(340px, 100%)",
              maxHeight: "min(620px, calc(100vh - 48px))",
              overflowY: "auto",
              background: "#FFF8F0",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 10px 24px rgba(61, 36, 25, 0.16)"
            }}
          >
            <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 7px", fontWeight: 500 }}>추천 이유</p>
            <p style={{ fontSize: "19px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500, lineHeight: 1.35 }}>{selectedAction.title}</p>
            <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.55 }}>{selectedAction.reasoning}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedAction.evidence.slice(0, 3).map((item) => (
                <div key={item} style={{ background: "#E8F3E5", borderRadius: "14px", padding: "12px" }}>
                  <p style={{ fontSize: "14px", color: "#1F4A1F", margin: 0, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedAction(null)}
              style={{
                marginTop: "14px",
                width: "100%",
                minHeight: "48px",
                border: 0,
                background: "linear-gradient(135deg, #FF8A65, #E07856)",
                borderRadius: "12px",
                padding: "14px",
                color: "white",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              액션으로 저장
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
