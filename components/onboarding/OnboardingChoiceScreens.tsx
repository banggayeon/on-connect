"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";
import { childProfile, consentSharing, parentProfile } from "@/lib/mockData";

function ScreenShell({
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

function Header({
  eyebrow,
  title,
  description,
  senior = false
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  senior?: boolean;
}) {
  return (
    <header style={{ marginBottom: "22px" }}>
      <p style={{ fontSize: senior ? "15px" : "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500, letterSpacing: "-0.005em" }}>
        {eyebrow}
      </p>
      <h1 style={{ fontSize: senior ? "32px" : "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
        {title}
      </h1>
      {description ? (
        <p style={{ fontSize: senior ? "18px" : "14px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
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
        background: disabled ? "#D5CFC8" : "#241E1A",
        color: disabled ? "#9A8B7D" : "#FBF6EC",
        border: "none",
        borderRadius: "999px",
        padding: senior ? "22px 26px" : "17px 22px",
        fontSize: senior ? "18px" : "16px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "-0.012em"
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
    <ScreenShell bgDeep>
      <Header eyebrow="시작하기" title="어느 쪽이세요?" description="선택에 따라 다른 화면이 준비돼요." />

      {/* 추상 도형 */}
      <div style={{ height: "90px", position: "relative", marginBottom: "28px" }}>
        <div style={{ position: "absolute", left: "4px", top: "22px", width: "72px", height: "72px", borderRadius: "999px", background: "#F6D6BD" }}/>
        <div style={{ position: "absolute", left: "54px", top: "6px", width: "72px", height: "72px", borderRadius: "999px", background: "#D9D0E5", mixBlendMode: "multiply" }}/>
        <div style={{ position: "absolute", left: "108px", top: "28px", width: "56px", height: "56px", borderRadius: "999px", background: "#D8E0A6", mixBlendMode: "multiply" }}/>
        <div style={{ position: "absolute", right: "0px", top: "36px", width: "92px", height: "34px", borderRadius: "999px", background: "#241E1A" }}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 부모님 옵션 */}
        <button
          type="button"
          onClick={() => setSelectedRole("parent")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "22px", borderRadius: "24px", gap: "14px", textAlign: "left",
            background: selectedRole === "parent" ? "#F1E5C8" : "#FFFBF2",
            color: "#241E1A",
            border: selectedRole === "parent" ? "2px solid #6E4A39" : "1px solid #E8DECF",
            fontFamily: "inherit", cursor: "pointer", width: "100%"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "999px",
              background: "#F1D6CC",
              flexShrink: 0
            }}/>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 3px", color: "#241E1A" }}>부모님이에요</p>
              <p style={{ fontSize: "13.5px", color: selectedRole === "parent" ? "#6E4A39" : "#8A6B5C", margin: 0, letterSpacing: "-0.01em" }}>자녀의 안부를 받고, 짧게 답해요</p>
            </div>
          </div>
          <div style={{
            width: "26px", height: "26px", borderRadius: "999px",
            border: `2px solid ${selectedRole === "parent" ? "#6E4A39" : "#D5C9BB"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            {selectedRole === "parent" && <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#6E4A39" }}/>}
          </div>
        </button>

        {/* 자녀 옵션 */}
        <button
          type="button"
          onClick={() => setSelectedRole("child")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "22px", borderRadius: "24px", gap: "14px", textAlign: "left",
            background: selectedRole === "child" ? "#F1E5C8" : "#FFFBF2",
            color: "#241E1A",
            border: selectedRole === "child" ? "2px solid #6E4A39" : "1px solid #E8DECF",
            fontFamily: "inherit", cursor: "pointer", width: "100%"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "999px",
              background: "#CDDCC8",
              flexShrink: 0
            }}/>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 3px", color: "#241E1A" }}>자녀예요</p>
              <p style={{ fontSize: "13.5px", color: selectedRole === "child" ? "#6E4A39" : "#8A6B5C", margin: 0, letterSpacing: "-0.01em" }}>부모님께 따뜻한 안부를 전해요</p>
            </div>
          </div>
          <div style={{
            width: "26px", height: "26px", borderRadius: "999px",
            border: `2px solid ${selectedRole === "child" ? "#6E4A39" : "#D5C9BB"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            {selectedRole === "child" && <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#6E4A39" }}/>}
          </div>
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "14px 0 0", textAlign: "center" }}>
        언제든 설정에서 변경할 수 있어요.
      </p>

      <NextButton disabled={!selectedRole} onClick={goNext} label="시작하기" />
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

      <div style={{ background: "#FFFBF2", border: "1px solid #241E1A", borderRadius: "18px", padding: "18px", marginBottom: "10px" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 6px" }}>이름</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          style={{
            width: "100%", border: "none", outline: "none",
            fontSize: "22px", color: "#241E1A", fontWeight: 500,
            background: "transparent", padding: 0
          }}
        />
      </div>

      <div style={{ background: "#FFFBF2", border: "1px solid #E8DECF", borderRadius: "18px", padding: "16px", marginBottom: "10px" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 10px", fontWeight: 500 }}>부모님이 부르는 호칭</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedNickname(option)}
              style={{
                background: selectedNickname === option ? "#241E1A" : "#F6EDDB",
                border: "none",
                borderRadius: "999px",
                padding: "12px 6px",
                textAlign: "center",
                fontSize: "14px",
                color: selectedNickname === option ? "#FBF6EC" : "#3D332C",
                fontWeight: selectedNickname === option ? 600 : 400,
                cursor: "pointer"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#CDDCC8", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "13px", color: "#241E1A", margin: "0 0 4px", fontWeight: 500 }}>✦ 생신은 나중에 알려주세요</p>
        <p style={{ fontSize: "13px", color: "#241E1A", opacity: 0.75, margin: 0, lineHeight: 1.5 }}>
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
    <ScreenShell bgDeep>
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
                background: selected ? "#F1E5C8" : "#FFFBF2",
                border: selected ? "2px solid #6E4A39" : "1px solid #E8DECF",
                borderRadius: "18px",
                padding: selected ? "15px 17px" : "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 3px", fontWeight: 500 }}>{option.label}</p>
                <p style={{ fontSize: "13px", color: selected ? "#6E4A39" : "#8A6B5C", margin: 0 }}>{option.description}</p>
              </div>
              <div style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: selected ? "#F1E5C8" : "transparent",
                border: selected ? "2px solid #6E4A39" : "1.5px solid #E8DECF",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {selected && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="#6E4A39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "14px" }}>
        <p style={{ fontSize: "13px", color: "#3D332C", margin: "0 0 4px", fontWeight: 500 }}>✦ 의무가 아니에요</p>
        <p style={{ fontSize: "13px", color: "#241E1A", opacity: 0.75, margin: 0, lineHeight: 1.5 }}>
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
  const options = [
    { value: "mom", label: parentProfile.name, badge: "엄", tone: "#F1D6CC" },
    { value: "dad", label: "아빠", badge: "아", tone: "#F6D6BD" },
    { value: "custom", label: "직접 입력하기", badge: "", tone: "" }
  ];

  function goNext() {
    if (!selectedName) return;
    window.localStorage.setItem("role", "parent");
    window.localStorage.setItem("parentDisplayName", selectedName);
    router.push("/onboarding/parent/signal-time");
  }

  return (
    <ScreenShell senior>
      <Header eyebrow="부모님 · 단계 2/3" title="호칭을 정해요" description="자녀에게 보일 이름이에요." senior />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedName(option.label)}
            style={{
              background: selectedName === option.label ? "#F1E5C8" : "#FFFBF2",
              border: selectedName === option.label ? "2px solid #6E4A39" : "1px solid #E8DECF",
              borderRadius: "18px",
              padding: selectedName === option.label ? "15px" : "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer"
            }}
          >
            {option.badge ? (
              <div style={{
                width: "40px", height: "40px", borderRadius: "999px",
                background: option.tone || "#F0E7D7",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", color: "#241E1A",
                fontWeight: 500, flexShrink: 0
              }}>
                {option.badge}
              </div>
            ) : (
              <div style={{ width: "40px", height: "40px", flexShrink: 0 }}/>
            )}
            <p style={{ fontSize: "19px", color: "#241E1A", margin: 0, fontWeight: selectedName === option.label ? 600 : 400, letterSpacing: "-0.015em" }}>
              {option.label}
            </p>
          </button>
        ))}
      </div>

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
    { value: "morning", label: "아침 · 8시", hint: '"잘 먹었니?"', tone: "#F1E5C8" },
    { value: "lunch",   label: "점심 · 12시", hint: '"점심은?"', tone: "#F6D6BD" },
    { value: "evening", label: "저녁 · 7시", hint: '"오늘 어땠어?"', tone: "#D9D0E5" }
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
    <ScreenShell senior bgDeep>
      <Header eyebrow="부모님 · 단계 3/3" title="언제 안부를 보내실래요?" description="버튼이 그 시간에 준비돼 있어요." senior />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
        {timeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedTime(option.value)}
            style={{
              background: selectedTime === option.value ? "#F1E5C8" : "#FFFBF2",
              border: selectedTime === option.value ? "2px solid #6E4A39" : "1px solid #E8DECF",
              borderRadius: "18px",
              padding: selectedTime === option.value ? "15px" : "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer"
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "999px",
              background: option.tone,
              flexShrink: 0
            }}/>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 2px", fontWeight: 500 }}>{option.label}</p>
              <p style={{ fontSize: "13px", color: selectedTime === option.value ? "#6E4A39" : "#8A6B5C", margin: 0 }}>{option.hint}</p>
            </div>
            <div style={{
              width: "20px", height: "20px", borderRadius: "999px",
              background: "transparent",
              border: `2px solid ${selectedTime === option.value ? "#6E4A39" : "#D5C9BB"}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              {selectedTime === option.value && <div style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#6E4A39" }}/>}
            </div>
          </button>
        ))}
      </div>

      {/* 공유 정보 동의 */}
      <div style={{ background: "#FFFBF2", borderRadius: "20px", padding: "18px", border: "1px solid #E8DECF" }}>
        <p style={{ fontSize: "16px", color: "#8A6B5C", margin: "0 0 6px", fontWeight: 500 }}>{consentSharing.title}</p>
        <p style={{ fontSize: "17px", color: "#241E1A", margin: "0 0 14px", lineHeight: 1.5 }}>{consentSharing.description}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {shareOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleScope(item.id)}
              style={{
                background: sharedScopes.includes(item.id) ? "#CDDCC8" : "#FAF6EE",
                border: sharedScopes.includes(item.id) ? "1px solid rgba(36,30,26,0.2)" : "1px solid #E8DECF",
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
                <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 2px", fontWeight: 500 }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>{item.description}</p>
              </div>
              <div style={{
                width: "40px", height: "24px", borderRadius: "999px",
                background: sharedScopes.includes(item.id) ? "#241E1A" : "#E8DECF",
                display: "flex", alignItems: "center", padding: "2px",
                flexShrink: 0, marginLeft: "10px"
              }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "white",
                  marginLeft: sharedScopes.includes(item.id) ? "auto" : 0
                }}/>
              </div>
            </button>
          ))}
        </div>
      </div>

      <NextButton disabled={!selectedTime} onClick={goNext} senior />
    </ScreenShell>
  );
}
