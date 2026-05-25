"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, Clock } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { mockCareActions } from "@/lib/mockData";

export default function CareActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const action = mockCareActions.find((a) => a.id === id) ?? mockCareActions[0];
  const [done, setDone] = useState(false);

  const TYPE_STYLE: Record<string, { bg: string; text: string }> = {
    call: { bg: "#E8F3E5", text: "#3A6B3A" },
    message: { bg: "#FFF1DA", text: "#7A5A1A" },
    visit: { bg: "#E0EDF5", text: "#2C5A7A" },
    gift: { bg: "#FFE5DA", text: "#8A3E25" }
  };
  const ts = TYPE_STYLE[action.type] ?? TYPE_STYLE.call;

  return (
    <DetailScreen title="케어 액션" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 액션 타이틀 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <span
          style={{
            fontSize: "11px",
            background: ts.bg,
            color: ts.text,
            borderRadius: "999px",
            padding: "3px 10px",
            fontWeight: 500,
            display: "inline-block",
            marginBottom: "10px"
          }}
        >
          {action.type === "call" ? "전화" : action.type === "message" ? "메시지" : action.type === "visit" ? "방문/산책" : "선물"}
        </span>
        <h2 style={{ fontSize: "22px", color: "#3D2419", margin: "0 0 10px", fontWeight: 500, lineHeight: 1.35 }}>
          {action.icon} {action.title}
        </h2>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>
          {action.reason}
        </p>
      </div>

      {/* 실행 가이드 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 8px", fontWeight: 500 }}>이렇게 해보세요</p>
        <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.6 }}>{action.guide}</p>
      </div>

      {/* 추천 시간대 */}
      {action.recommendedTime && (
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "14px 16px",
            boxShadow: "0 2px 8px rgba(61,36,25,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px"
          }}
        >
          <Clock size={18} style={{ color: "#E8A04E", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 2px", fontWeight: 500 }}>추천 시간</p>
            <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, fontWeight: 500 }}>{action.recommendedTime}</p>
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
              background: "#FBF6F0",
              color: "#8A6B5C",
              borderRadius: "999px",
              padding: "4px 12px"
            }}
          >
            #{kw}
          </span>
        ))}
      </div>

      {/* 선물 옵션 버튼 */}
      {action.hasGiftOption && (
        <button
          type="button"
          onClick={() => router.push(`/child/care/action/${id}/gift`)}
          style={{
            width: "100%",
            background: "white",
            border: "1.5px solid #F0E4D8",
            borderRadius: "16px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            marginBottom: "12px"
          }}
        >
          <div>
            <p style={{ fontSize: "14px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
              선물 옵션 보기
            </p>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{action.giftNote}</p>
          </div>
          <ChevronRight size={16} style={{ color: "#B07A5C" }} />
        </button>
      )}

      {/* 완료 버튼 */}
      {!done ? (
        <button
          type="button"
          onClick={() => setDone(true)}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
          }}
        >
          <CheckCircle size={18} /> 완료했어요
        </button>
      ) : (
        <div
          style={{
            background: "#E8F3E5",
            borderRadius: "16px",
            padding: "16px 18px",
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: "15px", color: "#1F4A1F", margin: 0, fontWeight: 600 }}>
            케어 액션을 기록했어요 ✓
          </p>
        </div>
      )}
    </DetailScreen>
  );
}
