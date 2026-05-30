"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

export default function CompletePage() {
  const router = useRouter();
  const [userName, setUserName]       = useState("");
  const [contactCount, setContactCount] = useState(0);
  const [hasReminder, setHasReminder]   = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") ?? "");
    const contacts = JSON.parse(localStorage.getItem("addedContacts") ?? "[]");
    setContactCount(contacts.length);
    const reminders = JSON.parse(localStorage.getItem("reminderTimes") ?? "[]");
    setHasReminder(reminders.length > 0);
  }, []);

  const REMINDER_LABEL: Record<string, string> = {
    morning: "아침 8시",
    evening: "저녁 8시",
    weekend: "주말",
  };

  const reminderTimes: string[] = JSON.parse(
    typeof window !== "undefined" ? (localStorage.getItem("reminderTimes") ?? "[]") : "[]"
  );

  const steps = [
    { label: "기본 정보 입력", done: true },
    {
      label: contactCount > 0 ? `챙길 사람 ${contactCount}명 추가` : "챙길 사람 추가",
      done: contactCount > 0,
    },
    {
      label: hasReminder
        ? `알림 설정 · ${reminderTimes.map(t => REMINDER_LABEL[t] ?? t).join(", ")}`
        : "알림 설정",
      done: hasReminder,
    },
    { label: "화면 설정 완료", done: true },
  ];

  return (
    <AppScreen>
      <div style={{ background: "#F6EDDB", minHeight: "100vh", padding: "30px 26px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>준비 완료</p>
        <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 20px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
          {userName ? `${userName}님, 준비됐어요` : "준비됐어요"} ☀
        </h1>

        {/* 설정 요약 카드 */}
        <div style={{ background: "#FFFBF2", border: "1px solid #E8DECF", borderRadius: "20px", padding: "18px", marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>설정 요약</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  background: s.done ? "#241E1A" : "#E8DECF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {s.done ? (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 3.5L4 6.5L10 1" stroke="#FBF6EC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B8A99A" }}/>
                  )}
                </div>
                <p style={{ fontSize: "14px", color: s.done ? "#241E1A" : "#9A8B7D", margin: 0, fontWeight: s.done ? 500 : 400 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 앞으로 할 수 있는 것 */}
        <div style={{ background: "#FFFBF2", borderRadius: "18px", padding: "18px", marginBottom: "12px", border: "1px solid #E8DECF" }}>
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>오늘 바로 해볼 수 있어요</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              "연락하기 좋은 사람 추천 받기",
              "오래된 친구에게 첫 문장 보내기",
              "대화 흐름 메모 남기기",
            ].map(item => (
              <div key={item} style={{
                background: "#F6EDDB", borderRadius: "12px",
                padding: "12px 14px", fontSize: "14px", color: "#241E1A", fontWeight: 500,
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, lineHeight: 1.5 }}>
            오래됐어도 괜찮아요. 한마디로 다시 시작할 수 있어요.
          </p>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            type="button"
            onClick={() => router.push("/child/home")}
            style={{
              width: "100%", background: "#241E1A", color: "#FBF6EC",
              border: "none", borderRadius: "999px", padding: "17px 22px",
              fontSize: "16px", fontWeight: 500, cursor: "pointer",
            }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </AppScreen>
  );
}
