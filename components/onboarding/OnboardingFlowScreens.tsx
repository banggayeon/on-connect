"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";
import { childProfile, consentSharing, parentHome } from "@/lib/mockData";

function FlowShell({
  children,
  background = "linear-gradient(180deg, #FFEDE0 0%, #FFF8F0 58%, #FFFFFF 100%)",
  senior = false
}: {
  children: React.ReactNode;
  background?: string;
  senior?: boolean;
}) {
  return (
    <AppScreen>
      <div
        style={{
          background,
          minHeight: "100vh",
          padding: "30px 22px 40px",
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
        background: "linear-gradient(135deg, #FF8A65, #E07856)",
        color: "white",
        border: "none",
        borderRadius: "18px",
        padding: senior ? "18px" : "15px",
        fontSize: senior ? "21px" : "16px",
        fontWeight: 500,
        cursor: "pointer",
        marginTop: "20px",
        boxShadow: "0 6px 18px rgba(224,120,86,0.28)"
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
        {/* 溫 로고 */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF8A65, #FFB088)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(224,120,86,0.28)",
            marginBottom: "20px",
            marginTop: "20px"
          }}
        >
          <span style={{ color: "white", fontSize: "30px", fontWeight: 500 }}>溫</span>
        </div>

        <p style={{ fontSize: "14px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>온(溫) 커넥트</p>
        <h1 style={{ fontSize: "30px", color: "#3D2419", margin: "0 0 10px", fontWeight: 500, lineHeight: 1.3 }}>
          가족 안부가
          <br />
          부담이 되지 않게
        </h1>
        <p style={{ fontSize: "15px", color: "#8A6B5C", margin: 0, lineHeight: 1.6 }}>
          부모와 자녀를 잇는
          <br />
          따뜻한 시그널
        </p>

        <div
          style={{
            width: "100%",
            background: "white",
            borderRadius: "22px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(61,36,25,0.06)",
            marginTop: "28px",
            textAlign: "left"
          }}
        >
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>오늘 준비된 것</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {["관계 온도", "Warm Reply AI", "동의 기반 케어 신호"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#FBF6F0",
                  borderRadius: "14px",
                  padding: "12px 14px"
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E07856", flexShrink: 0 }} />
                <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", marginTop: "auto" }}>
          <PrimaryButton onClick={() => router.push("/onboarding/role")}>시작하기</PrimaryButton>
          <p style={{ fontSize: "13px", color: "#B07A5C", margin: "14px 0 0" }}>이미 계정이 있어요 · 로그인</p>
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
    <FlowShell senior>
      <p style={{ fontSize: "14px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>부모님 · 단계 1/3</p>

      {/* 연결 일러스트 카드 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF8A65, #FFB088)",
          borderRadius: "22px",
          padding: "22px",
          color: "white",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              fontWeight: 500
            }}
          >
            {childProfile.name.charAt(0)}
          </div>
          <span style={{ fontSize: "18px" }}>→</span>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              fontWeight: 500
            }}
          >
            엄
          </div>
        </div>
        <p style={{ fontSize: "14px", opacity: 0.95, margin: 0, lineHeight: 1.5 }}>
          &quot;{childProfile.name}, 우리 따뜻한 안부 주고받아요&quot;
        </p>
      </div>

      <h1 style={{ fontSize: "32px", color: "#3D2419", margin: "0 0 10px", fontWeight: 500, lineHeight: 1.3 }}>
        큰 글씨로
        <br />
        안부를 보내요
      </h1>
      <p style={{ fontSize: "19px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
        버튼 하나로 자녀에게 안부를 보내고, 공유할 정보는 직접 고를 수 있어요.
      </p>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.06)"
        }}
      >
        <p style={{ fontSize: "17px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>{consentSharing.title}</p>
        <p style={{ fontSize: "18px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>{consentSharing.description}</p>
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
    { name: "엄마", gradient: "linear-gradient(135deg, #FFB088, #FF8A65)" },
    { name: "아빠", gradient: "linear-gradient(135deg, #FFD9B8, #E8A04E)" }
  ];

  function sendInvite(name: string) {
    setConfirmFor(name);
  }

  function closeConfirm() {
    setSentTo(confirmFor);
    setConfirmFor(null);
  }

  return (
    <FlowShell background="linear-gradient(180deg, #FFEDE0 0%, #FFF8F0 100%)">
      <p style={{ fontSize: "13px", color: "#3A6B3A", margin: "0 0 4px", fontWeight: 500 }}>자녀 · 단계 2/4</p>
      <h1 style={{ fontSize: "28px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>
        부모님을 초대해요
      </h1>
      <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
        한 분만 먼저 시작해도 괜찮아요
      </p>

      {/* 부모 초대 카드들 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        {parents.map(({ name, gradient }) => {
          const sent = sentTo === name;
          return (
            <div
              key={name}
              style={{
                background: "white",
                border: sent ? "1.5px solid #7AB87A" : "1px solid #F0E4D8",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 1px 6px rgba(61,36,25,0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 500
                  }}
                >
                  {name.charAt(0)}
                </div>
                <p style={{ fontSize: "16px", color: "#3D2419", margin: 0, fontWeight: 500 }}>{name}</p>
                {sent && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: "#3A6B3A",
                      background: "#E8F3E5",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontWeight: 500
                    }}
                  >
                    초대 완료
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => sendInvite(name)}
                style={{
                  width: "100%",
                  background: sent
                    ? "#F0E4D8"
                    : "linear-gradient(135deg, #FF8A65, #E07856)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px",
                  textAlign: "center",
                  cursor: sent ? "default" : "pointer",
                  boxShadow: sent ? "none" : "0 4px 12px rgba(224,120,86,0.22)"
                }}
              >
                <p style={{ fontSize: "14px", color: sent ? "#B07A5C" : "white", margin: 0, fontWeight: 500 }}>
                  {sent ? "초대 보냄" : "카톡으로 초대 보내기"}
                </p>
              </button>
            </div>
          );
        })}

        {/* 추가 버튼 */}
        <div
          style={{
            border: "1.5px dashed #E07856",
            borderRadius: "14px",
            padding: "14px",
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: "14px", color: "#E07856", margin: "0 0 2px", fontWeight: 500 }}>+ 더 추가하기</p>
          <p style={{ fontSize: "12px", color: "#B07A5C", margin: 0 }}>선택 · 나중에 추가 가능</p>
        </div>
      </div>

      {/* 초대 미리보기 */}
      <div style={{ background: "#FFF1DA", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "12px", color: "#7A5A1A", margin: "0 0 6px", fontWeight: 500 }}>✦ 초대 메시지 미리보기</p>
        <p style={{ fontSize: "13px", color: "#5F4534", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
          &quot;엄마, 우리 따뜻한 안부 주고받아요. 여기서 시작해요 →&quot;
        </p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton onClick={() => router.push("/onboarding/child/reminder")}>다음</PrimaryButton>
      </div>

      {/* 초대 완료 확인 모달 */}
      {confirmFor ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,36,32,0.36)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 50
          }}
        >
          <div
            style={{
              width: "min(320px, 100%)",
              background: "white",
              borderRadius: "22px",
              padding: "28px 24px 20px",
              textAlign: "center",
              boxShadow: "0 12px 32px rgba(44,36,32,0.18)"
            }}
          >
            {/* 아이콘 */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8A65, #FFB088)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 6px 16px rgba(224,120,86,0.26)"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: "20px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500 }}>
              {confirmFor}에게 초대를 보냈어요
            </p>
            <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 22px", lineHeight: 1.5 }}>
              {confirmFor}이 가입하시면 연결이 완료돼요.
            </p>
            <button
              type="button"
              onClick={closeConfirm}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #FF8A65, #E07856)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "14px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(224,120,86,0.26)"
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
    <FlowShell background="linear-gradient(180deg, #FFEDE0 0%, #FFF8F0 100%)">
      <p style={{ fontSize: "13px", color: "#3A6B3A", margin: "0 0 4px", fontWeight: 500 }}>자녀 · 단계 4/4</p>
      <h1 style={{ fontSize: "28px", color: "#3D2419", margin: "0 0 20px", fontWeight: 500, lineHeight: 1.3 }}>
        준비 완료 ☀
      </h1>

      {/* 연결 일러스트 */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF8A65, #FFB088)",
          borderRadius: "20px",
          padding: "20px",
          color: "white",
          textAlign: "center",
          marginBottom: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            엄
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 0.7, 0.4].map((opacity, i) => (
              <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: `rgba(255,255,255,${opacity})` }} />
            ))}
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            {childProfile.name.charAt(0)}
          </div>
        </div>
        <p style={{ fontSize: "13px", opacity: 0.92, margin: 0 }}>초대 보냄 · 응답 대기중</p>
      </div>

      {/* 안내 카드 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "12px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>먼저 둘러보세요</p>
        <p style={{ fontSize: "15px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>
          부모님이 가입하시는 동안 홈에서 시작 안부를 보낼 수 있어요
        </p>
      </div>

      {/* 오늘부터 볼 수 있는 것 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {["부모님별 관계 온도", "오늘의 Parent Briefing", "선물보다 먼저 할 케어 액션"].map((item) => (
          <div
            key={item}
            style={{
              background: "#E8F3E5",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "14px",
              color: "#1F4A1F",
              fontWeight: 500
            }}
          >
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
    <FlowShell senior>
      <p style={{ fontSize: "16px", color: "#B07A5C", margin: "0 0 4px", fontWeight: 500 }}>연결 완료</p>
      <h1 style={{ fontSize: "34px", color: "#3D2419", margin: "0 0 20px", fontWeight: 500, lineHeight: 1.25 }}>
        이제 안부를
        <br />
        보낼 수 있어요
      </h1>

      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "22px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.06)",
          marginBottom: "16px"
        }}
      >
        <p style={{ fontSize: "20px", color: "#3D2419", margin: "0 0 8px", fontWeight: 500 }}>
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
