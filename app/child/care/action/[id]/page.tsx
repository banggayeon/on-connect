"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { mockCareActions } from "@/lib/mockData";

const TYPE_STYLE: Record<string, { bg: string }> = {
  call:    { bg: "#CDDCC8" },
  message: { bg: "#F6D6BD" },
  visit:   { bg: "#D9D0E5" },
  gift:    { bg: "#F1D6CC" }
};

const TYPE_LABEL: Record<string, string> = {
  call: "전화", message: "메시지", visit: "방문/산책", gift: "선물"
};

export default function CareActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const action = mockCareActions.find((a) => a.id === id) ?? mockCareActions[0];
  const [done, setDone] = useState(false);

  const ts = TYPE_STYLE[action.type] ?? TYPE_STYLE.call;

  return (
    <DetailScreen title="케어 액션">
      {/* 액션 타이틀 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "20px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <span
          style={{
            fontSize: "11px",
            background: ts.bg,
            color: "#241E1A",
            borderRadius: "999px",
            padding: "3px 10px",
            fontWeight: 500,
            display: "inline-block",
            marginBottom: "10px"
          }}
        >
          {TYPE_LABEL[action.type] ?? action.type}
        </span>
        <h2 style={{ fontSize: "22px", color: "#241E1A", margin: "0 0 10px", fontWeight: 700, lineHeight: 1.35, letterSpacing: "-0.02em" }}>
          {action.icon} {action.title}
        </h2>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>
          {action.reason}
        </p>
      </div>

      {/* 실행 가이드 */}
      <div
        style={{
          background: "#F6D6BD",
          borderRadius: "22px",
          padding: "18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 8px", fontWeight: 500 }}>이렇게 해보세요</p>
        <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.6 }}>{action.guide}</p>
      </div>

      {/* 추천 시간대 */}
      {action.recommendedTime && (
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "18px",
            padding: "14px 16px",
            border: "1px solid #E8DECF",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px"
          }}
        >
          <span style={{ fontSize: "20px", flexShrink: 0 }}>⏰</span>
          <div>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 2px", fontWeight: 500 }}>추천 시간</p>
            <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{action.recommendedTime}</p>
          </div>
        </div>
      )}

      {/* 관련 키워드 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {action.relatedKeywords.map((kw) => (
          <span
            key={kw}
            style={{
              fontSize: "12px",
              background: "#F0E7D7",
              color: "#3D332C",
              borderRadius: "999px",
              padding: "4px 12px"
            }}
          >
            #{kw}
          </span>
        ))}
      </div>

      {/* CTA — gift type: 선물 옵션 보기 primary; others: 완료했어요 primary */}
      {action.hasGiftOption ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={() => router.push(`/child/care/action/${id}/gift`)}
            style={{
              width: "100%",
              background: "#241E1A",
              color: "#FBF6EC",
              border: "none",
              borderRadius: "999px",
              padding: "16px 18px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            선물 옵션 보기
          </button>
          {!done ? (
            <button
              type="button"
              onClick={() => setDone(true)}
              style={{
                width: "100%",
                background: "#FFFBF2",
                color: "#241E1A",
                border: "1px solid #E8DECF",
                borderRadius: "999px",
                padding: "15px 18px",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              완료했어요
            </button>
          ) : (
            <div style={{ background: "#CDDCC8", borderRadius: "999px", padding: "15px 18px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>케어 액션을 기록했어요 ✓</p>
            </div>
          )}
        </div>
      ) : !done ? (
        <button
          type="button"
          onClick={() => setDone(true)}
          style={{
            width: "100%",
            background: "#241E1A",
            color: "#FBF6EC",
            border: "none",
            borderRadius: "999px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          ✓ 완료했어요
        </button>
      ) : (
        <div style={{ background: "#CDDCC8", borderRadius: "999px", padding: "16px 18px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>케어 액션을 기록했어요 ✓</p>
        </div>
      )}
    </DetailScreen>
  );
}
