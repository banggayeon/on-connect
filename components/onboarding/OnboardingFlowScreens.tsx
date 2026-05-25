"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";
import { childProfile, consentSharing, parentHome } from "@/lib/mockData";

function FlowShell({
  children,
  bgDeep = false,
  senior = false
}: {
  children: React.ReactNode;
  bgDeep?: boolean;
  senior?: boolean;
}) {
  return (
    <AppScreen>
      <div
        style={{
          background: bgDeep ? "#F6EDDB" : "#FAF6EE",
          minHeight: "100vh",
          padding: "30px 26px 40px",
          display: "flex",
          flexDirection: "column",
          fontSize: senior ? "18px" : "16px"
        }}
      >
        {children}
      </div>
    </AppScreen>
  );
}

function PrimaryButton({
  children,
  onClick,
  senior = false
}: {
  children: React.ReactNode;
  onClick: () => void;
  senior?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        background: "#241E1A",
        color: "#FBF6EC",
        border: "none",
        borderRadius: "999px",
        padding: senior ? "22px 26px" : "17px 22px",
        fontSize: senior ? "18px" : "16px",
        fontWeight: 500,
        cursor: "pointer",
        marginTop: "20px",
        letterSpacing: "-0.012em"
      }}
    >
      {children}
    </button>
  );
}

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <FlowShell>
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
        {/* 추상 도형 */}
        <div style={{ height: "90px", width: "100%", position: "relative", marginBottom: "10px", marginTop: "20px" }}>
          <div style={{ position: "absolute", left: "4px", top: "22px", width: "72px", height: "72px", borderRadius: "999px", background: "#F6D6BD" }}/>
          <div style={{ position: "absolute", left: "54px", top: "6px", width: "72px", height: "72px", borderRadius: "999px", background: "#D9D0E5", mixBlendMode: "multiply" }}/>
          <div style={{ position: "absolute", left: "108px", top: "28px", width: "56px", height: "56px", borderRadius: "999px", background: "#D8E0A6", mixBlendMode: "multiply" }}/>
          <div style={{ position: "absolute", right: "0px", top: "36px", width: "92px", height: "34px", borderRadius: "999px", background: "#241E1A" }}/>
        </div>

        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "20px 0 6px", fontWeight: 500, letterSpacing: "-0.005em" }}>온(溫) 커넥트</p>
        <h1 style={{ fontSize: "38px", color: "#241E1A", margin: "0 0 14px", fontWeight: 700, lineHeight: 1.18, letterSpacing: "-0.035em" }}>
          서로의 안부를<br/>부담 없이.
        </h1>
        <p style={{ fontSize: "15.5px", color: "#3D332C", margin: 0, lineHeight: 1.65, opacity: 0.8, marginBottom: "28px" }}>
          가족에게 맞는 화면으로 시작해요.<br/>나중에 다시 바꿀 수 있어요.
        </p>

        <div
          style={{
            width: "100%",
            background: "#FFFBF2",
            borderRadius: "22px",
            padding: "20px",
            border: "1px solid #E8DECF",
            textAlign: "left"
          }}
        >
          <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>오늘 준비된 것</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {["관계 온도", "Warm Reply AI", "동의 기반 케어 신호"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#F6EDDB",
                  borderRadius: "14px",
                  padding: "13px 14px"
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#241E1A", opacity: 0.5, flexShrink: 0 }} />
                <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", marginTop: "auto" }}>
          <PrimaryButton onClick={() => router.push("/onboarding/role")}>시작하기</PrimaryButton>
          <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "14px 0 0" }}>이미 계정이 있어요 · 로그인</p>
        </div>
      </main>
    </FlowShell>
  );
}

export function ParentWelcomeScreen() {
  const router = useRouter();

  function start() {
    window.localStorage.setItem("role", "parent");
    router.push("/onboarding/parent/profile");
  }

  return (
    <FlowShell senior bgDeep>
      <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>부모님 · 단계 1/3</p>

      {/* 연결 일러스트 카드 — lime 블록 */}
      <div
        style={{
          background: "#D8E0A6",
          borderRadius: "22px",
          padding: "22px",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              width: "44px", height: "44px", borderRadius: "999px",
              background: "rgba(36,30,26,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "17px", fontWeight: 500, color: "#241E1A"
            }}
          >
            {childProfile.name.charAt(0)}
          </div>
          <span style={{ fontSize: "18px", color: "#241E1A" }}>→</span>
          <div
            style={{
              width: "44px", height: "44px", borderRadius: "999px",
              background: "rgba(36,30,26,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "17px", fontWeight: 500, color: "#241E1A"
            }}
          >
            엄
          </div>
        </div>
        <p style={{ fontSize: "14px", color: "#241E1A", opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
          &quot;{childProfile.name}, 우리 따뜻한 안부 주고받아요&quot;
        </p>
      </div>

      <h1 style={{ fontSize: "32px", color: "#241E1A", margin: "0 0 10px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
        큰 글씨로<br/>안부를 보내요
      </h1>
      <p style={{ fontSize: "19px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
        버튼 하나로 자녀에게 안부를 보내고, 공유할 정보는 직접 고를 수 있어요.
      </p>

      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "20px",
          border: "1px solid #E8DECF"
        }}
      >
        <p style={{ fontSize: "17px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>{consentSharing.title}</p>
        <p style={{ fontSize: "18px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>{consentSharing.description}</p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton senior onClick={start}>시작하기</PrimaryButton>
      </div>
    </FlowShell>
  );
}

export function ChildInviteScreen() {
  const router = useRouter();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [confirmFor, setConfirmFor] = useState<string | null>(null);

  const parents = [
    { name: "엄마", tone: "#F1D6CC" },
    { name: "아빠", tone: "#F6D6BD" }
  ];

  function sendInvite(name: string) { setConfirmFor(name); }
  function closeConfirm() { setSentTo(confirmFor); setConfirmFor(null); }

  return (
    <FlowShell bgDeep>
      <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>자녀 · 단계 2/4</p>
      <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
        부모님을 초대해요
      </h1>
      <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
        한 분만 먼저 시작해도 괜찮아요
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        {parents.map(({ name, tone }) => {
          const sent = sentTo === name;
          return (
            <div
              key={name}
              style={{
                background: "#FFFBF2",
                border: sent ? "1.5px solid #E8DECF" : "1px solid #E8DECF",
                borderRadius: "18px",
                padding: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "999px",
                  background: tone,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 500, color: "#241E1A"
                }}>
                  {name.charAt(0)}
                </div>
                <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{name}</p>
                {sent && (
                  <span style={{
                    marginLeft: "auto", fontSize: "12px", color: "#6E4A39",
                    background: "#CDDCC8", padding: "3px 10px",
                    borderRadius: "999px", fontWeight: 500
                  }}>
                    초대 완료
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => sendInvite(name)}
                style={{
                  width: "100%", background: sent ? "#F0E7D7" : "#241E1A",
                  border: "none", borderRadius: "999px",
                  padding: "13px", textAlign: "center",
                  cursor: sent ? "default" : "pointer"
                }}
              >
                <p style={{ fontSize: "14px", color: sent ? "#8A6B5C" : "#FBF6EC", margin: 0, fontWeight: 500 }}>
                  {sent ? "초대 보냄" : "카톡으로 초대 보내기"}
                </p>
              </button>
            </div>
          );
        })}

        <div style={{ border: "1.5px dashed #E8DECF", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 2px", fontWeight: 500 }}>+ 더 추가하기</p>
          <p style={{ fontSize: "12px", color: "#9A8B7D", margin: 0 }}>선택 · 나중에 추가 가능</p>
        </div>
      </div>

      <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "12px", color: "#3D332C", margin: "0 0 6px", fontWeight: 500 }}>✦ 초대 메시지 미리보기</p>
        <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
          &quot;엄마, 우리 따뜻한 안부 주고받아요. 여기서 시작해요 →&quot;
        </p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton onClick={() => router.push("/onboarding/child/reminder")}>다음</PrimaryButton>
      </div>

      {confirmFor ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, background: "rgba(36,30,26,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", zIndex: 50
          }}
        >
          <div style={{
            width: "min(320px, 100%)", background: "#FAF6EE",
            borderRadius: "22px", padding: "28px 24px 20px",
            textAlign: "center"
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "999px",
              background: "#CDDCC8",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#241E1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: "20px", color: "#241E1A", margin: "0 0 8px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {confirmFor}에게 초대를 보냈어요
            </p>
            <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 22px", lineHeight: 1.5 }}>
              {confirmFor}이 가입하시면 연결이 완료돼요.
            </p>
            <button
              type="button"
              onClick={closeConfirm}
              style={{
                width: "100%", background: "#241E1A", color: "#FBF6EC",
                border: "none", borderRadius: "999px",
                padding: "17px", fontSize: "16px", fontWeight: 500, cursor: "pointer"
              }}
            >
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </FlowShell>
  );
}

export function ChildCompleteScreen() {
  const router = useRouter();

  return (
    <FlowShell bgDeep>
      <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>자녀 · 단계 4/4</p>
      <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 20px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
        준비 완료 ☀
      </h1>

      <div style={{ background: "#CDDCC8", borderRadius: "20px", padding: "20px", textAlign: "center", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "999px",
            background: "rgba(36,30,26,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 500, color: "#241E1A"
          }}>엄</div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 0.5, 0.25].map((opacity, i) => (
              <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: `rgba(36,30,26,${opacity})` }}/>
            ))}
          </div>
          <div style={{
            width: "36px", height: "36px", borderRadius: "999px",
            background: "rgba(36,30,26,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 500, color: "#241E1A"
          }}>{childProfile.name.charAt(0)}</div>
        </div>
        <p style={{ fontSize: "13px", color: "#241E1A", opacity: 0.75, margin: 0 }}>초대 보냄 · 응답 대기중</p>
      </div>

      <div style={{ background: "#FFFBF2", borderRadius: "18px", padding: "18px", marginBottom: "12px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>먼저 둘러보세요</p>
        <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, lineHeight: 1.5 }}>
          부모님이 가입하시는 동안 홈에서 시작 안부를 보낼 수 있어요
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {["부모님별 관계 온도", "오늘의 Parent Briefing", "선물보다 먼저 할 케어 액션"].map((item) => (
          <div key={item} style={{ background: "#D9D0E5", borderRadius: "14px", padding: "13px 14px", fontSize: "14px", color: "#241E1A", fontWeight: 500 }}>
            {item}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton onClick={() => router.push("/child/home")}>홈으로 가기</PrimaryButton>
      </div>
    </FlowShell>
  );
}

export function ParentCompleteScreen() {
  const router = useRouter();

  return (
    <FlowShell senior bgDeep>
      <p style={{ fontSize: "16px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>연결 완료</p>
      <h1 style={{ fontSize: "34px", color: "#241E1A", margin: "0 0 20px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
        이제 안부를<br/>보낼 수 있어요
      </h1>

      <div style={{ background: "#FFFBF2", borderRadius: "22px", padding: "22px", border: "1px solid #E8DECF", marginBottom: "16px" }}>
        <p style={{ fontSize: "20px", color: "#241E1A", margin: "0 0 8px", fontWeight: 600, letterSpacing: "-0.02em" }}>
          {parentHome.mainCardTitle}
        </p>
        <p style={{ fontSize: "18px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          선택한 시간에 큰 안부 버튼을 준비해둘게요.
        </p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton senior onClick={() => router.push("/parent/home")}>홈으로 가기</PrimaryButton>
      </div>
    </FlowShell>
  );
}
