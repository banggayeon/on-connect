import { CareActionCard, type CareActionItem } from "@/components/child/CareActionCard";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { demoFather, demoMother } from "@/lib/demoDataset";
import { consentSharing, giftRecommendations } from "@/lib/mockData";

const GIFT_TONES = ["#F1D6CC", "#CDDCC8", "#D9D0E5", "#F6D6BD"];

export default function ChildGiftPage() {
  const careActions: CareActionItem[] = [
    {
      id: "mom_heat_pack_gift",
      parentName: demoMother.displayName,
      title: "찜질팩을 케어 메모로 남기기",
      kind: "care-item",
      description: "허리 이야기가 반복되어도 바로 선물 구매보다, 엄마가 편하게 받을 수 있는지 먼저 물어봐요.",
      actionLabel: "메모하기",
      evidence: [demoMother.careSignals[0].evidence, demoMother.conversationMemos[1].memo, demoMother.giftCandidates[0].reason],
      reasoning: "엄마는 따뜻하고 예의 있는 말투를 선호하고, 건강 질문이 길어지면 부담을 느낄 수 있어요. 찜질팩은 선물보다 케어 메모로 먼저 두는 편이 자연스럽습니다."
    },
    {
      id: "mom_lumbar_cushion_gift",
      parentName: demoMother.displayName,
      title: "허리 쿠션 후보 저장",
      kind: "care-item",
      description: "생신 이후 건강을 챙기는 맥락으로, 오래 앉을 때 편한지 묻고 후보만 저장해요.",
      actionLabel: "액션으로 저장",
      evidence: [`${demoMother.preferenceProfile.birthday.label}: ${demoMother.preferenceProfile.birthday.month}월 ${demoMother.preferenceProfile.birthday.day}일`, demoMother.careSignals[0].recommendationHint, demoMother.conversationMemos[1].suggestedFollowUp],
      reasoning: "생신 직후에는 큰 선물보다 실용적인 케어 후보를 낮은 부담으로 제안하는 흐름이 관계 온도에 더 잘 맞습니다."
    },
    {
      id: "dad_hiking_socks_gift",
      parentName: demoFather.displayName,
      title: "등산 양말 후보 저장",
      kind: "care-item",
      description: "아빠가 등산화를 언급했지만, 바로 큰 선물보다 부담 낮은 실용 아이템으로 시작해요.",
      actionLabel: "메모하기",
      evidence: [demoFather.conversationMemos[0].memo, demoFather.careSignals[1].evidence, demoFather.giftCandidates[0].reason],
      reasoning: "아빠는 실용적이고 짧은 제안을 선호하므로, 등산 양말처럼 가격 부담이 낮고 취미와 연결되는 후보가 적합합니다."
    },
    {
      id: "dad_weekend_walk_gift",
      parentName: demoFather.displayName,
      title: "짧은 산책 제안하기",
      kind: "care-action",
      description: "선물 대신 시간을 함께 쓰는 행동으로 연결해요. 사진에 반응하고 주말 산책을 한 문장으로 제안합니다.",
      actionLabel: "이번 주말에 하기",
      evidence: [demoFather.careSignals[2].evidence, demoFather.preferenceProfile.preferredContactWindows[1].reason, `관심사: ${demoFather.preferenceProfile.interests.slice(0, 2).join(", ")}`],
      reasoning: "아빠는 등산/산책 사진으로 대화를 시작하는 패턴이 있어, 구매보다 함께 걷는 제안이 더 관계 중심적인 액션입니다."
    }
  ];

  return (
    <ChildAppShell>
      <header style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>
          {giftRecommendations.screen.eyebrow}
        </p>
        <h1 style={{ fontSize: "26px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
          {giftRecommendations.screen.title}
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {giftRecommendations.screen.description}
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* D-day 배너 */}
        <div
          style={{
            background: "#F1E5C8",
            borderRadius: "26px",
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6E4A39", margin: "0 0 4px" }}>
                {giftRecommendations.occasion.dDay}
              </p>
              <h2 style={{ fontSize: "22px", fontWeight: 700, margin: 0, color: "#241E1A", letterSpacing: "-0.02em" }}>
                {giftRecommendations.occasion.label}
              </h2>
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#241E1A",
                background: "rgba(255,255,255,0.6)",
                padding: "6px 14px",
                borderRadius: "999px"
              }}
            >
              {giftRecommendations.occasion.dateText}
            </span>
          </div>
        </div>

        {/* 맞춤 추천 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500 }}>
              {giftRecommendations.sectionTitle}
            </p>
            <span style={{ fontSize: "11px", color: "#241E1A", background: "#D8E0A6", padding: "3px 8px", borderRadius: "999px", fontWeight: 600 }}>
              AI
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {giftRecommendations.items.map((gift, idx) => (
              <div
                key={gift.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  background: "#FAF6EE",
                  borderRadius: "18px",
                  padding: "12px"
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: GIFT_TONES[idx % GIFT_TONES.length],
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}
                >
                  🎁
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>
                    {gift.name}
                  </p>
                  <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 6px" }}>{gift.meta}</p>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#F0E7D7",
                      borderRadius: "999px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      color: "#3D332C",
                      fontWeight: 500
                    }}
                  >
                    {gift.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 이유 */}
        <div
          style={{
            background: "#D8E0A6",
            borderRadius: "22px",
            padding: "16px 18px"
          }}
        >
          <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 8px", fontWeight: 600 }}>
            🎁 {giftRecommendations.recommendationReasonTitle}
          </p>
          <p style={{ fontSize: "14px", color: "#241E1A", margin: 0, lineHeight: 1.55 }}>
            {giftRecommendations.recommendationReason}
          </p>
        </div>

        {/* 케어 액션 안내 */}
        <div
          style={{
            background: "#FFFBF2",
            borderRadius: "26px",
            padding: "18px",
            border: "1px solid #E8DECF"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 6px", fontWeight: 500 }}>
            {giftRecommendations.careActionTitle}
          </p>
          <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 6px", fontWeight: 600, lineHeight: 1.4 }}>
            선물보다 먼저, 부모님이 부담 없이 받을 수 있는 케어 액션을 추천해요.
          </p>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>
            {giftRecommendations.careActionSummary}
          </p>
        </div>

        {/* CTA 버튼 */}
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
          {giftRecommendations.ctaLabel}
        </button>
      </div>

      <CareActionCard
        title="선물보다 먼저 할 케어 액션"
        description="구매보다 관계 회복과 돌봄 행동을 먼저 저장해요."
        consentNotice={{ title: consentSharing.childNoticeTitle, body: consentSharing.childNoticeBody }}
        actions={careActions}
      />
    </ChildAppShell>
  );
}
