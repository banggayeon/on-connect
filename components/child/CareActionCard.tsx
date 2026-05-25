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
    <section style={{ padding: "0 22px 30px" }}>
      <div
        style={{
          background: "#F1D6CC",
          borderRadius: "22px",
          padding: "18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 8px", fontWeight: 500 }}>동의 기반 공유</p>
        <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 8px", fontWeight: 500, lineHeight: 1.45 }}>{consentNotice.title}</p>
        <p style={{ fontSize: "14px", color: "#3D332C", margin: 0, lineHeight: 1.55 }}>{consentNotice.body}</p>
      </div>

      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "22px",
          padding: "20px",
          border: "1px solid #E8DECF"
        }}
      >
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>{title}</p>
        <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 14px", fontWeight: 500, lineHeight: 1.45 }}>{description}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => setSelectedAction(action)}
              style={{
                width: "100%",
                border: "1px solid #E8DECF",
                background: "#FAF6EE",
                borderRadius: "18px",
                padding: "15px",
                textAlign: "left",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 5px", fontWeight: 500 }}>
                    {action.parentName} · {getKindLabel(action.kind)}
                  </p>
                  <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{action.title}</p>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: "12px",
                    color: "#241E1A",
                    background: action.kind === "care-action" ? "#D8E0A6" : "#F6D6BD",
                    borderRadius: "999px",
                    padding: "6px 9px",
                    fontWeight: 500
                  }}
                >
                  AI 추천
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 10px", lineHeight: 1.5 }}>{action.description}</p>
              <div style={{ background: "#CDDCC8", borderRadius: "14px", padding: "11px" }}>
                <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.45 }}>{action.actionLabel}</p>
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
            background: "rgba(36,30,26,0.32)",
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
              background: "#FFFBF2",
              borderRadius: "26px",
              padding: "20px",
              boxShadow: "0 10px 24px rgba(36,30,26,0.18)"
            }}
          >
            <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 7px", fontWeight: 500 }}>추천 이유</p>
            <p style={{ fontSize: "19px", color: "#241E1A", margin: "0 0 8px", fontWeight: 600, lineHeight: 1.35 }}>{selectedAction.title}</p>
            <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 14px", lineHeight: 1.55 }}>{selectedAction.reasoning}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedAction.evidence.slice(0, 3).map((item) => (
                <div key={item} style={{ background: "#CDDCC8", borderRadius: "14px", padding: "12px" }}>
                  <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>{item}</p>
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
                background: "#241E1A",
                borderRadius: "999px",
                padding: "14px",
                color: "#FBF6EC",
                fontSize: "15px",
                fontWeight: 600,
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
