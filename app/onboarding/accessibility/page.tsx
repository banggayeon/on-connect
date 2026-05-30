"use client";

import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

export default function AccessibilityPage() {
  const router = useRouter();

  function goStandard() {
    localStorage.setItem("role", "child");
    router.push("/onboarding/complete");
  }

  function goSenior() {
    localStorage.setItem("role", "parent");
    router.push("/onboarding/parent/welcome");
  }

  return (
    <AppScreen>
      <div style={{ background: "#FAF6EE", minHeight: "100vh", padding: "30px 26px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>단계 3/3 · 화면 설정</p>
        <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
          어떤 화면이<br/>편하세요?
        </h1>
        <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 28px", lineHeight: 1.5 }}>
          언제든 설정에서 바꿀 수 있어요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 기본 화면 */}
          <button
            type="button"
            onClick={goStandard}
            style={{
              background: "#FFFBF2", border: "1px solid #E8DECF",
              borderRadius: "22px", padding: "20px",
              cursor: "pointer", textAlign: "left", width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "#F6EDDB", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>📱</div>
              <div>
                <p style={{ fontSize: "18px", color: "#241E1A", margin: "0 0 4px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  지금 이 화면이 좋아요
                </p>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", lineHeight: 1.5 }}>
                  일반 화면 · 다양한 기능
                </p>
                <div style={{
                  background: "#F6EDDB", borderRadius: "12px", padding: "10px 12px",
                  display: "flex", flexDirection: "column", gap: "6px",
                }}>
                  {["오늘 연락해볼 사람이 있어요", "첫 문장 추천받기", "대화 흐름 메모"].map(item => (
                    <p key={item} style={{ fontSize: "12px", color: "#6E4A39", margin: 0, display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6E4A39", flexShrink: 0, display: "inline-block" }}/>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* 큰 글씨 화면 */}
          <button
            type="button"
            onClick={goSenior}
            style={{
              background: "#FFFBF2", border: "1px solid #E8DECF",
              borderRadius: "22px", padding: "20px",
              cursor: "pointer", textAlign: "left", width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "#F1D6CC", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>🔠</div>
              <div>
                <p style={{ fontSize: "18px", color: "#241E1A", margin: "0 0 4px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  큰 글씨가 더 편해요
                </p>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 12px", lineHeight: 1.5 }}>
                  어르신용 화면 · 큰 버튼 · 간단한 구성
                </p>
                <div style={{
                  background: "#F6EDDB", borderRadius: "12px", padding: "10px 12px",
                  display: "flex", flexDirection: "column", gap: "6px",
                }}>
                  {["큰 글씨와 간단한 버튼", "안부 한 번에 보내기", "글씨 크기 직접 조절"].map(item => (
                    <p key={item} style={{ fontSize: "12px", color: "#6E4A39", margin: 0, display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6E4A39", flexShrink: 0, display: "inline-block" }}/>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "#9A8B7D", margin: "16px 0 0", textAlign: "center" }}>
          탭해서 선택하면 바로 시작돼요.
        </p>
      </div>
    </AppScreen>
  );
}
