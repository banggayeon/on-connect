"use client";

import { useRouter } from "next/navigation";
import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { ParentToggle } from "@/components/child/ParentToggle";
import { demoDataset } from "@/lib/mockData";
import type { ContactRecord } from "@/lib/types";

function getContactStats(records: ContactRecord[]) {
  const count = records.length;
  if (count === 0) return { count: 0, avgInterval: 0 };
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return { count, avgInterval: 0 };
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1].date);
    const b = new Date(sorted[i].date);
    const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) gaps.push(diff);
  }
  const avgInterval = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 1;
  return { count, avgInterval };
}

function getTopics(records: ContactRecord[]): string[] {
  const tagCount: Record<string, number> = {};
  records.forEach((r) => {
    r.tags.forEach((t) => {
      if (!["low_response", "gift_hint", "brief", "brief_call", "missed_call", "practical"].includes(t)) {
        tagCount[t] = (tagCount[t] ?? 0) + 1;
      }
    });
  });
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);
}

const TOPIC_KO: Record<string, string> = {
  meal: "식사", walk: "산책", weather: "날씨", health: "건강",
  back: "허리", sleep: "수면", photo: "사진", hiking: "등산",
  birthday: "생신", food: "음식", morning: "아침", evening: "저녁",
  plants: "식물", outing: "외출", work: "업무", visit: "방문",
  holiday: "연휴", friends: "모임", baseball: "야구", car: "자동차",
  thanks: "감사", parents_day: "어버이날", knee: "무릎", gift: "선물",
  fatigue: "피로", driving: "운전", news: "뉴스",
};

export default function ReportPage() {
  const router = useRouter();
  const { selectedParentId, parentProfile } = useSelectedParent();

  const parentData = demoDataset.parents.find((p) => p.id === selectedParentId);
  const records = parentData?.contactRecords30Days ?? [];
  const { count, avgInterval } = getContactStats(records);
  const topics = getTopics(records);
  const avoidedTopics = parentData?.preferenceProfile.avoidedTopics ?? [];
  const isMom = selectedParentId === "parent_mother";

  const nextWeekRecommendation = isMom
    ? "짧은 안부를 먼저 보내고, 답장이 오면 산책이나 식사 이야기를 이어가보세요."
    : "가볍게 안부를 먼저 보내고, 아빠가 좋아하는 주제(등산, 야구)로 이어가보세요.";
  const cautionDetail = isMom
    ? "건강 상태를 자세히 캐묻는 질문은 부담이 될 수 있어요. 가볍게 안부를 묻는 편이 좋아요."
    : "용돈이나 재정 이야기는 먼저 꺼내지 않는 편이 좋아요.";

  return (
    <DetailScreen title="이번 달 관계 리포트">
      <ParentToggle />

      {/* 프라이버시 안내 */}
      <div style={{ background: "#F0E7D7", borderRadius: "14px", padding: "10px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: 0, lineHeight: 1.5 }}>
          허락한 내용과 사용자가 선택한 메시지만 바탕으로 보여드려요.
        </p>
      </div>

      {/* 1. 연락 횟수 */}
      <div style={{ background: "#F1D6CC", borderRadius: "22px", padding: "20px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 6px", fontWeight: 600 }}>이번 달 연락 횟수</p>
        <p style={{ fontSize: "26px", fontWeight: 700, color: "#241E1A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          {count}회
        </p>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: 0 }}>
          {parentProfile.displayName}과 안부를 나눴어요.
        </p>
      </div>

      {/* 2. 평균 연락 간격 */}
      <div style={{ background: "#D8E0A6", borderRadius: "22px", padding: "20px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 6px", fontWeight: 600 }}>평균 연락 간격</p>
        <p style={{ fontSize: "26px", fontWeight: 700, color: "#241E1A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          {avgInterval > 0 ? `${avgInterval}일` : "—"}
        </p>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: 0 }}>
          {avgInterval > 0 ? `평균 ${avgInterval}일에 한 번 연락했어요.` : "연락 기록이 충분하지 않아요."}
        </p>
      </div>

      {/* 3. 자주 나온 주제 */}
      {topics.length > 0 && (
        <div style={{
          background: "#FFFBF2", borderRadius: "22px",
          padding: "18px", border: "1px solid #E8DECF", marginBottom: "12px"
        }}>
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 600 }}>자주 나온 주제</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {topics.map((t) => (
              <span key={t} style={{
                fontSize: "13px", padding: "7px 16px", borderRadius: "999px",
                background: "#F0E7D7", color: "#3D332C", fontWeight: 500
              }}>
                {TOPIC_KO[t] ?? t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. 조심하면 좋은 주제 */}
      <div style={{
        background: "#FFFBF2", borderRadius: "22px",
        padding: "18px", border: "1px solid #E8DECF", marginBottom: "12px"
      }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 600 }}>조심하면 좋은 주제</p>
        <p style={{ fontSize: "13px", color: "#241E1A", margin: "0 0 10px", lineHeight: 1.6 }}>
          {cautionDetail}
        </p>
        {avoidedTopics.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
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
      </div>

      {/* 5. 다음 주 추천 액션 */}
      <div style={{
        background: "#F6D6BD", borderRadius: "22px",
        padding: "18px", marginBottom: "20px"
      }}>
        <p style={{ fontSize: "12px", color: "#6E4A39", margin: "0 0 8px", fontWeight: 600 }}>다음 주 추천 액션</p>
        <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
          {nextWeekRecommendation}
        </p>
      </div>

      {/* 부드러운 면책 고지 */}
      <p style={{ fontSize: "12px", color: "#9A8B7D", textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
        이 리포트는 평가가 아니라 관계 리듬을 함께 살펴보기 위한 참고예요.
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={() => router.push("/child/signal/recommend")}
        style={{
          width: "100%", background: "#241E1A", color: "#FBF6EC",
          border: "none", borderRadius: "999px",
          padding: "17px", fontSize: "16px", fontWeight: 600,
          cursor: "pointer"
        }}
      >
        이번 주 안부 추천받기
      </button>
    </DetailScreen>
  );
}
