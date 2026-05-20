import { Activity, HeartPulse, Moon } from "lucide-react";
import { CareActionCard, type CareActionItem } from "@/components/child/CareActionCard";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { demoFather, demoMother } from "@/lib/demoDataset";
import { careReport, consentSharing } from "@/lib/mockData";

export default function ChildCarePage() {
  const careActions: CareActionItem[] = [
    {
      id: "mom_lumbar_cushion",
      parentName: demoMother.displayName,
      title: "허리 쿠션 메모하기",
      kind: "care-item",
      description: "바로 구매보다 먼저, 엄마가 오래 앉아 있는 시간에 불편함이 있는지 자연스럽게 확인해요.",
      actionLabel: "메모하기",
      evidence: [demoMother.careSignals[0].evidence, demoMother.conversationMemos[1].memo, `관심사: ${demoMother.preferenceProfile.interests.slice(0, 3).join(", ")}`],
      reasoning: "허리 이야기가 반복되지만 직접적인 건강 질문은 부담스러울 수 있어, 실용적인 쿠션을 메모해두고 일상 안부로 먼저 확인하는 흐름이 좋아요."
    },
    {
      id: "mom_heat_pack",
      parentName: demoMother.displayName,
      title: "찜질팩 챙겨드리기",
      kind: "care-item",
      description: "허리 이야기를 바로 병원 이야기로 넘기지 않고, 집에서 편하게 쓸 수 있는 케어 아이템으로 연결해요.",
      actionLabel: "이번 주말에 하기",
      evidence: [demoMother.careSignals[0].title, demoMother.conversationMemos[1].suggestedFollowUp, `${demoMother.preferenceProfile.birthday.label} 이후 건강 챙김 맥락`],
      reasoning: "생신 이후 고마움과 건강 신호가 함께 있어, 부담 낮은 찜질팩은 선물보다 케어 행동에 가깝게 전달할 수 있어요."
    },
    {
      id: "mom_hospital_help",
      parentName: demoMother.displayName,
      title: "병원 예약 도와드리기",
      kind: "care-action",
      description: "바로 예약을 밀어붙이기보다, 원하시면 알아봐드릴게요 정도의 낮은 압박으로 제안해요.",
      actionLabel: "액션으로 저장",
      evidence: [demoMother.careSignals[0].recommendationHint, demoMother.preferenceProfile.avoidedTopics[0], demoMother.conversationMemos[1].title],
      reasoning: "건강 신호는 있지만 직접적인 병원 압박은 피해야 하므로, 선택권을 부모님께 두는 문장이 적합합니다."
    },
    {
      id: "dad_short_walk",
      parentName: demoFather.displayName,
      title: "짧은 산책 제안하기",
      kind: "care-action",
      description: "등산 사진에 반응한 뒤 무릎 부담이 적은 코스로 같이 걷자고 제안해요.",
      actionLabel: "이번 주말에 하기",
      evidence: [demoFather.careSignals[1].evidence, demoFather.conversationMemos[0].suggestedFollowUp, `관심사: ${demoFather.preferenceProfile.interests.slice(0, 3).join(", ")}`],
      reasoning: "아빠는 짧고 실용적인 말투를 선호하고 등산/산책 사진을 자주 공유하므로, 긴 걱정보다 짧은 산책 제안이 자연스럽습니다."
    }
  ];

  return (
    <ChildAppShell className="bg-gradient-to-b from-[#E8F3E5] via-cream-50 to-white">
      {/* Header */}
      <header style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>
          {careReport.screen.eyebrow}
        </p>
        <h1 style={{ fontSize: "24px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>
          {careReport.screen.title}
        </h1>
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {careReport.screen.description}
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 이번 주 안부 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>
            {careReport.weeklyCheckinsTitle}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "4px" }}>
            {careReport.weeklyCheckins.map((day) => (
              <div key={day.day} style={{ textAlign: "center", flex: 1 }}>
                <span
                  className={day.colorClass}
                  style={{
                    display: "block",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    margin: "0 auto"
                  }}
                />
                <p style={{ fontSize: "11px", color: "#8A6B5C", margin: "5px 0 0" }}>{day.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 건강 알림 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, fontWeight: 600 }}>
              {careReport.healthAlert.title}
            </p>
            <span
              style={{
                fontSize: "12px",
                color: "#3A6B3A",
                background: "#E8F3E5",
                padding: "4px 10px",
                borderRadius: "999px",
                fontWeight: 500
              }}
            >
              {careReport.healthAlert.statusText}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ background: "#FBF6F0", borderRadius: "14px", padding: "14px" }}>
              <HeartPulse size={20} style={{ marginBottom: "8px", color: "#E07856" }} />
              <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 4px" }}>
                {careReport.healthAlert.metrics[0].label}
              </p>
              <p style={{ fontSize: "18px", color: "#3D2419", margin: 0, fontWeight: 600 }}>
                {careReport.healthAlert.metrics[0].value}
              </p>
            </div>
            <div style={{ background: "#FBF6F0", borderRadius: "14px", padding: "14px" }}>
              <Activity size={20} style={{ marginBottom: "8px", color: "#7AB87A" }} />
              <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 4px" }}>
                {careReport.healthAlert.metrics[1].label}
              </p>
              <p style={{ fontSize: "18px", color: "#3D2419", margin: 0, fontWeight: 600 }}>
                {careReport.healthAlert.metrics[1].value}
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 따뜻한 일 */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFF1DA, #FFE5DA)",
            borderRadius: "18px",
            padding: "18px"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A3E25", margin: "0 0 6px", fontWeight: 500 }}>
            {careReport.warmAction.title}
          </p>
          <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.4 }}>
            {careReport.warmAction.headline}
          </p>
          <p style={{ fontSize: "13px", color: "#5F4534", margin: 0, lineHeight: 1.55 }}>
            {careReport.warmAction.body}
          </p>
        </div>

        {/* 수면 리듬 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
            display: "flex",
            gap: "12px"
          }}
        >
          <Moon size={22} style={{ flexShrink: 0, color: "#7DA8C8", marginTop: "2px" }} />
          <div>
            <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 6px", fontWeight: 600 }}>
              {careReport.sleepRhythm.title}
            </p>
            <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.55 }}>
              {careReport.sleepRhythm.body}
            </p>
          </div>
        </div>

        {/* AI 시그널 */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "18px",
            boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>
            {careReport.aiSignals.label}
          </p>
          <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.4 }}>
            {careReport.aiSignals.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {careReport.aiSignals.items.map((item) => (
              <p
                key={item}
                style={{
                  background: "#E8F3E5",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#1F4A1F",
                  margin: 0,
                  lineHeight: 1.55
                }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <CareActionCard consentNotice={{ title: consentSharing.childNoticeTitle, body: consentSharing.childNoticeBody }} actions={careActions} />
    </ChildAppShell>
  );
}
