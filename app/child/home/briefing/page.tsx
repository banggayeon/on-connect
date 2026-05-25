"use client";

import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { ParentToggle } from "@/components/child/ParentToggle";
import { demoDataset } from "@/lib/mockData";

function ChipTag({ label }: { label: string }) {
  const TOPIC_KO: Record<string, string> = {
    meal: "식사", walk: "산책", weather: "날씨", health: "건강",
    back: "허리", sleep: "수면", photo: "사진", hiking: "등산",
    birthday: "생신", food: "음식", morning: "아침", evening: "저녁",
    plants: "식물", outing: "외출", work: "업무", visit: "방문",
    holiday: "연휴", friends: "모임", baseball: "야구", car: "자동차",
  };
  return (
    <span style={{
      fontSize: "13px", padding: "6px 14px", borderRadius: "999px",
      background: "#F0E7D7", color: "#3D332C", fontWeight: 500
    }}>
      {TOPIC_KO[label] ?? label}
    </span>
  );
}

function getTopTopics(parentId: string): string[] {
  const parent = demoDataset.parents.find((p) => p.id === parentId);
  if (!parent) return [];
  const tagCount: Record<string, number> = {};
  parent.contactRecords30Days.forEach((r) => {
    r.tags.forEach((t) => {
      if (!["low_response", "gift_hint", "brief", "brief_call", "missed_call", "practical", "thanks"].includes(t)) {
        tagCount[t] = (tagCount[t] ?? 0) + 1;
      }
    });
  });
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}

export default function BriefingPage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();

  const parentData = demoDataset.parents.find((p) => p.id === selectedParentId);
  const memo = parentData?.conversationMemos[0];
  const signal = parentData?.careSignals[0];
  const briefing = parentData?.agentSeedSummary.parentBriefing;
  const avoidedTopics = parentData?.preferenceProfile.avoidedTopics ?? [];
  const topTopics = getTopTopics(selectedParentId);
  const isMom = selectedParentId === "parent_mother";

  const recentSummary = isMom
    ? "엄마는 이번 주 산책과 식사 이야기를 자주 했어요."
    : "아빠는 이번 주 등산과 야구 이야기를 자주 했어요.";
  const goodTopic = isMom
    ? "요즘 날씨 괜찮던데, 산책 다녀오셨어요?"
    : "요즘 야구 경기 어때요? 재밌던 경기 있었어요?";
  const cautionTopic = isMom
    ? "건강을 자세히 캐묻기보다 편하게 안부를 묻는 편이 좋아요."
    : "용돈이나 건강 이야기는 짧게, 가볍게 이어가세요.";

  return (
    <DetailScreen title="대화 전 맥락 브리핑">
      <ParentToggle />

      {/* 프라이버시 안내 */}
      <div style={{
        background: "#F0E7D7", borderRadius: "16px",
        padding: "12px 16px", marginBottom: "16px"
      }}>
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: 0, lineHeight: 1.55 }}>
          부모님이 허락한 내용과 사용자가 선택한 메시지만 바탕으로 보여드려요.
        </p>
      </div>

      {/* 1. 최근 대화 요약 */}
      <div style={{
        background: "#FFFBF2", borderRadius: "22px",
        padding: "18px", border: "1px solid #E8DECF", marginBottom: "12px"
      }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 600 }}>최근 대화 요약</p>
        <p style={{ fontSize: "16px", color: "#241E1A", margin: "0 0 12px", fontWeight: 600, lineHeight: 1.45, letterSpacing: "-0.015em" }}>
          {recentSummary}
        </p>
        {topTopics.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {topTopics.map((t) => <ChipTag key={t} label={t} />)}
          </div>
        )}
        {memo && (
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "12px 0 0", lineHeight: 1.5 }}>
            {memo.memo}
          </p>
        )}
      </div>

      {/* 2. 오늘 꺼내기 좋은 말 */}
      <div style={{
        background: "#F6D6BD", borderRadius: "22px",
        padding: "18px", marginBottom: "12px"
      }}>
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 8px", fontWeight: 600 }}>오늘 꺼내기 좋은 말</p>
        <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 10px", fontWeight: 600, lineHeight: 1.45, letterSpacing: "-0.015em" }}>
          &ldquo;{goodTopic}&rdquo;
        </p>
        {briefing && (
          <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
            {briefing.recommendedAction}
          </p>
        )}
      </div>

      {/* 3. 조심하면 좋은 주제 */}
      <div style={{
        background: "#FFFBF2", borderRadius: "22px",
        padding: "18px", border: "1px solid #E8DECF", marginBottom: "12px"
      }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 600 }}>조심하면 좋은 주제</p>
        <p style={{ fontSize: "14px", color: "#241E1A", margin: "0 0 10px", lineHeight: 1.55 }}>
          {cautionTopic}
        </p>
        {avoidedTopics.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {avoidedTopics.map((t) => (
              <span key={t} style={{
                fontSize: "12px", padding: "4px 12px", borderRadius: "999px",
                background: "#F1D6CC", color: "#6E4A39", fontWeight: 500
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
        {signal && (
          <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "10px 0 0", lineHeight: 1.5 }}>
            {signal.recommendationHint}
          </p>
        )}
      </div>

      {/* 4. 근거 */}
      <div style={{
        background: "#FFFBF2", borderRadius: "22px",
        padding: "18px", border: "1px solid #E8DECF", marginBottom: "20px"
      }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 600 }}>근거</p>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.6 }}>
          최근 공유된 대화와 부모님이 허락한 정보만 바탕으로 정리했어요.
          카카오톡이나 문자 내용을 자동으로 수집하지 않아요.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => router.push("/child/signal/recommend")}
        style={{
          width: "100%", background: "#241E1A", color: "#FBF6EC",
          border: "none", borderRadius: "999px",
          padding: "17px", fontSize: "16px", fontWeight: 600,
          cursor: "pointer", marginBottom: "10px"
        }}
      >
        추천 문장 보기
      </button>
      <button
        type="button"
        onClick={() => router.push("/child/signal/recommend")}
        style={{
          width: "100%", background: "#FFFBF2", color: "#241E1A",
          border: "1px solid #E8DECF", borderRadius: "999px",
          padding: "15px", fontSize: "14px", fontWeight: 500,
          cursor: "pointer"
        }}
      >
        다른 추천 보기
      </button>
    </DetailScreen>
  );
}
