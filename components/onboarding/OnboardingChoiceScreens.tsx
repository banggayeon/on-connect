"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";
import { childProfile, consentSharing, parentProfile } from "@/lib/mockData";

function ScreenShell({
  children,
  background = "#FFF8F0",
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

function Header({
  eyebrow,
  title,
  description,
  senior = false,
  eyebrowColor = "#3A6B3A"
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  senior?: boolean;
  eyebrowColor?: string;
}) {
  return (
    <header style={{ marginBottom: "22px" }}>
      <p style={{ fontSize: senior ? "15px" : "13px", color: eyebrowColor, margin: "0 0 4px", fontWeight: 500 }}>
        {eyebrow}
      </p>
      <h1 style={{ fontSize: senior ? "32px" : "28px", color: "#3D2419", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>
        {title}
      </h1>
      {description ? (
        <p style={{ fontSize: senior ? "18px" : "15px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      ) : null}
    </header>
  );
}

function NextButton({
  disabled,
  onClick,
  senior = false,
  label = "다음"
}: {
  disabled: boolean;
  onClick: () => void;
  senior?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        marginTop: "20px",
        width: "100%",
        background: disabled
          ? "#E5DED6"
          : "linear-gradient(135deg, #FF8A65, #E07856)",
        color: disabled ? "#9E948A" : "white",
        border: "none",
        borderRadius: "18px",
        padding: senior ? "18px" : "15px",
        fontSize: senior ? "21px" : "16px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 6px 18px rgba(224,120,86,0.28)"
      }}
    >
      {label}
    </button>
  );
}

/* ─── 역할 선택 ─── */
export function RoleChoiceScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"parent" | "child" | null>(null);

  function goNext() {
    if (!selectedRole) return;
    window.localStorage.setItem("role", selectedRole);
    router.push(selectedRole === "parent" ? "/onboarding/parent/welcome" : "/onboarding/child/profile");
  }

  return (
    <ScreenShell>
      <Header eyebrow="단계 1/4" title="어느 쪽이세요?" description="선택에 따라 다른 화면이 준비돼요." eyebrowColor="#B07A5C" />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* 부모님 옵션 */}
        <button
          type="button"
          onClick={() => setSelectedRole("parent")}
          style={{
            background: selectedRole === "parent" ? "linear-gradient(135deg, #FFE5DA, #FFF8F0)" : "white",
            border: selectedRole === "parent" ? "2px solid #E07856" : "1.5px solid #F0E4D8",
            borderRadius: "18px",
            padding: "16px",
            textAlign: "left",
            cursor: "pointer",
            boxShadow: selectedRole === "parent" ? "0 4px 14px rgba(224,120,86,0.14)" : "0 1px 6px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFB088, #FF8A65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "15px",
                fontWeight: 500
              }}
            >
              부
            </div>
            <p style={{ fontSize: "17px", color: "#3D2419", margin: 0, fontWeight: 500 }}>부모님이에요</p>
          </div>
          <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
            자녀에게 안부를 보내고 답을 받아요 · 큰 글씨 지원
          </p>
        </button>

        {/* 자녀 옵션 */}
        <button
          type="button"
          onClick={() => setSelectedRole("child")}
          style={{
            background: selectedRole === "child"
              ? "linear-gradient(135deg, #E8F3E5, #F6FBF4)"
              : "white",
            border: selectedRole === "child" ? "2px solid #7AB87A" : "1.5px solid #F0E4D8",
            borderRadius: "18px",
            padding: "16px",
            textAlign: "left",
            cursor: "pointer",
            boxShadow: selectedRole === "child" ? "0 4px 14px rgba(122,184,122,0.14)" : "0 1px 6px rgba(61,36,25,0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #A8D5A8, #7AB87A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "15px",
                fontWeight: 500
              }}
            >
              자
            </div>
            <p style={{ fontSize: "17px", color: "#3D2419", margin: 0, fontWeight: 500 }}>자녀예요</p>
          </div>
          <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.4 }}>
            부모님 안부에 답하고 케어 정보를 확인해요
          </p>
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#B07A5C", margin: "14px 0 0", textAlign: "center" }}>
        언제든 설정에서 변경할 수 있어요.
      </p>

      <NextButton
        disabled={!selectedRole}
        onClick={goNext}
        label="다음"
      />
    </ScreenShell>
  );
}

/* ─── 자녀 프로필 ─── */
export function ChildProfileChoiceScreen() {
  const router = useRouter();
  const [name, setName] = useState(childProfile.name);
  const [selectedNickname, setSelectedNickname] = useState<string | null>(null);
  const options = ["우리 딸", "우리 아들", "직접 입력"];

  function goNext() {
    if (!selectedNickname || !name.trim()) return;
    window.localStorage.setItem("role", "child");
    window.localStorage.setItem("childName", name.trim());
    window.localStorage.setItem("childNickname", selectedNickname);
    router.push("/onboarding/child/invite");
  }

  return (
    <ScreenShell>
      <Header eyebrow="자녀 · 단계 1/4" title="당신을 알려주세요" description="부모님께 표시될 이름과 호칭이에요." />

      {/* 이름 입력 필드 */}
      <div
        style={{
          background: "white",
          border: "2px solid #7AB87A",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "10px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 6px" }}>이름</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "22px",
            color: "#3D2419",
            fontWeight: 500,
            background: "transparent",
            padding: 0
          }}
        />
      </div>

      {/* 호칭 선택 */}
      <div
        style={{
          background: "white",
          border: "1px solid #F0E4D8",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "10px",
          boxShadow: "0 1px 6px rgba(61,36,25,0.04)"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 10px", fontWeight: 500 }}>부모님이 부르는 호칭</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedNickname(option)}
              style={{
                background: selectedNickname === option ? "#FFE5DA" : "#F5E8DC",
                border: selectedNickname === option ? "1.5px solid #E07856" : "1.5px solid transparent",
                borderRadius: "12px",
                padding: "10px 6px",
                textAlign: "center",
                fontSize: "14px",
                color: selectedNickname === option ? "#8A3E25" : "#5F4534",
                fontWeight: selectedNickname === option ? 600 : 400,
                cursor: "pointer"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 생신 안내 */}
      <div style={{ background: "#E8F3E5", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "13px", color: "#3A6B3A", margin: "0 0 4px", fontWeight: 500 }}>✦ 생신은 나중에 알려주세요</p>
        <p style={{ fontSize: "13px", color: "#1F4A1F", margin: 0, lineHeight: 1.5 }}>
          부모님이 가입하시면 자동으로 채워져요.
        </p>
      </div>

      <NextButton disabled={!selectedNickname || !name.trim()} onClick={goNext} />
    </ScreenShell>
  );
}

/* ─── 자녀 알림 시간 ─── */
export function ChildReminderChoiceScreen() {
  const router = useRouter();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const options = [
    { value: "morning", label: "아침 · 8시", description: '"엄마 아침 드셨을까요?"' },
    { value: "evening", label: "저녁 · 8시", description: '"오늘 안부 챙겼나요?"' },
    { value: "weekend", label: "주말마다", description: '"주말이에요, 통화 한번?"' }
  ];

  function toggle(value: string) {
    setSelectedTimes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function goNext() {
    if (selectedTimes.length === 0) return;
    window.localStorage.setItem("childReminderTimes", JSON.stringify(selectedTimes));
    router.push("/onboarding/child/complete");
  }

  return (
    <ScreenShell background="linear-gradient(180deg, #E8F3E5 0%, #FFF8F0 58%, #FFFFFF 100%)">
      <Header eyebrow="자녀 · 단계 3/4" title="언제 챙겨드릴까요?" description="여러 시간 동시에 선택할 수 있어요." />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {options.map((option) => {
          const selected = selectedTimes.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              style={{
                background: selected ? "#F6FBF4" : "white",
                border: selected ? "2px solid #7AB87A" : "1px solid #F0E4D8",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: selected ? "0 2px 8px rgba(122,184,122,0.16)" : "none"
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 3px", fontWeight: 500 }}>{option.label}</p>
                <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>{option.description}</p>
              </div>
              {/* 체크박스 스타일 인디케이터 */}
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  background: selected ? "#7AB87A" : "transparent",
                  border: selected ? "none" : "1.5px solid #D0C8C0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {selected && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 안내 카드 */}
      <div style={{ background: "#FFE5DA", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "13px", color: "#8A3E25", margin: "0 0 4px", fontWeight: 500 }}>✦ 의무가 아니에요</p>
        <p style={{ fontSize: "13px", color: "#5F2A14", margin: 0, lineHeight: 1.5 }}>
          잊지 않게 살짝 떠올려드릴 뿐이에요.
        </p>
      </div>

      <NextButton disabled={selectedTimes.length === 0} onClick={goNext} />
    </ScreenShell>
  );
}

/* ─── 부모님 프로필 ─── */
export function ParentProfileChoiceScreen() {
  const router = useRouter();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [largeText, setLargeText] = useState(false);
  const options = [
    { value: "mom", label: parentProfile.name, badge: "엄", badgeBg: "#FFE5DA", badgeColor: "#8A3E25" },
    { value: "dad", label: "아빠", badge: "아", badgeBg: "#FFF1DA", badgeColor: "#7A5A1A" },
    { value: "custom", label: "직접 입력하기", badge: "", badgeBg: "", badgeColor: "" }
  ];

  function goNext() {
    if (!selectedName) return;
    window.localStorage.setItem("role", "parent");
    window.localStorage.setItem("parentDisplayName", selectedName);
    window.localStorage.setItem("largeText", String(largeText));
    router.push("/onboarding/parent/signal-time");
  }

  return (
    <ScreenShell senior>
      <Header eyebrow="부모님 · 단계 2/3" title="호칭을 정해요" description="자녀에게 보일 이름이에요." senior eyebrowColor="#B07A5C" />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedName(option.label)}
            style={{
              background: "white",
              border: selectedName === option.label ? "2px solid #E07856" : "1px solid #F0E4D8",
              borderRadius: "16px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              boxShadow: selectedName === option.label ? "0 2px 8px rgba(224,120,86,0.14)" : "none"
            }}
          >
            {option.badge ? (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: option.badgeBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  color: option.badgeColor,
                  fontWeight: 500,
                  flexShrink: 0
                }}
              >
                {option.badge}
              </div>
            ) : (
              <div style={{ width: "36px", height: "36px", flexShrink: 0 }} />
            )}
            <p style={{ fontSize: "19px", color: "#3D2419", margin: 0, fontWeight: selectedName === option.label ? 500 : 400 }}>
              {option.label}
            </p>
          </button>
        ))}
      </div>

      {/* 큰 글씨 모드 토글 */}
      <button
        type="button"
        aria-pressed={largeText}
        onClick={() => setLargeText((v) => !v)}
        style={{
          background: "#FFF1DA",
          border: "none",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          width: "100%",
          textAlign: "left"
        }}
      >
        <div>
          <p style={{ fontSize: "19px", color: "#3D2419", margin: "0 0 3px", fontWeight: 500 }}>큰 글씨 모드</p>
          <p style={{ fontSize: "14px", color: "#8A6B5C", margin: 0 }}>눈이 편안해요</p>
        </div>
        <div
          style={{
            width: "48px",
            height: "28px",
            borderRadius: "999px",
            background: largeText ? "#E07856" : "#F0E4D8",
            display: "flex",
            alignItems: "center",
            padding: "2px",
            flexShrink: 0,
            transition: "background 0.2s"
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "white",
              marginLeft: largeText ? "auto" : 0,
              transition: "margin 0.2s"
            }}
          />
        </div>
      </button>

      <NextButton disabled={!selectedName} onClick={goNext} senior />
    </ScreenShell>
  );
}

/* ─── 부모님 안부 시간 ─── */
export function ParentSignalTimeChoiceScreen() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sharedScopes, setSharedScopes] = useState<string[]>([]);
  const shareOptions = useMemo(() => consentSharing.items, []);

  const timeOptions = [
    { value: "morning", label: "아침 · 8시", hint: '"잘 먹었니?"', dotBg: "linear-gradient(135deg, #FFD9B8, #E8A04E)" },
    { value: "lunch", label: "점심 · 12시", hint: '"점심은?"', dotBg: "linear-gradient(135deg, #FFB088, #FF8A65)" },
    { value: "evening", label: "저녁 · 7시", hint: '"오늘 어땠어?"', dotBg: "linear-gradient(135deg, #B8D4E5, #7DA8C8)" }
  ];

  function toggleScope(scope: string) {
    setSharedScopes((cur) => cur.includes(scope) ? cur.filter((s) => s !== scope) : [...cur, scope]);
  }

  function goNext() {
    if (!selectedTime) return;
    window.localStorage.setItem("parentSignalTime", selectedTime);
    window.localStorage.setItem("parentSharedScopes", JSON.stringify(sharedScopes));
    router.push("/onboarding/parent/complete");
  }

  return (
    <ScreenShell background="linear-gradient(180deg, #FFF1DA 0%, #FFF8F0 52%, #FFFFFF 100%)" senior>
      <Header eyebrow="부모님 · 단계 3/3" title="언제 안부를 보내실래요?" description="버튼이 그 시간에 준비돼 있어요." senior eyebrowColor="#B07A5C" />

      {/* 시간 선택 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
        {timeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedTime(option.value)}
            style={{
              background: "white",
              border: selectedTime === option.value ? "2px solid #E07856" : "1px solid #F0E4D8",
              borderRadius: "16px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              boxShadow: selectedTime === option.value ? "0 2px 8px rgba(224,120,86,0.14)" : "none"
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: option.dotBg,
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>{option.label}</p>
              <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0 }}>{option.hint}</p>
            </div>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: selectedTime === option.value ? "#E07856" : "transparent",
                border: selectedTime === option.value ? "none" : "1.5px solid #D0C8C0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {selectedTime === option.value && (
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 공유 정보 동의 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)"
        }}
      >
        <p style={{ fontSize: "16px", color: "#B07A5C", margin: "0 0 6px", fontWeight: 500 }}>{consentSharing.title}</p>
        <p style={{ fontSize: "17px", color: "#3D2419", margin: "0 0 14px", lineHeight: 1.5 }}>{consentSharing.description}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {shareOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleScope(item.id)}
              style={{
                background: sharedScopes.includes(item.id) ? "#E8F3E5" : "#FBF6F0",
                border: sharedScopes.includes(item.id) ? "1.5px solid #7AB87A" : "1.5px solid #F0E4D8",
                borderRadius: "14px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.description}</p>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "24px",
                  borderRadius: "999px",
                  background: sharedScopes.includes(item.id) ? "#7AB87A" : "#F0E4D8",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  flexShrink: 0,
                  marginLeft: "10px"
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "white",
                    marginLeft: sharedScopes.includes(item.id) ? "auto" : 0
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <NextButton disabled={!selectedTime} onClick={goNext} senior />
    </ScreenShell>
  );
}
