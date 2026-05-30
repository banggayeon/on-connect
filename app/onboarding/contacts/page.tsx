"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

type ContactItem = {
  id: string;
  name: string;
  relation: string;
  tone: string;
  char: string;
  added: boolean;
};

const MOCK_CONTACTS: ContactItem[] = [
  { id: "parent_mother", name: "엄마", relation: "가족", tone: "#F1D6CC", char: "엄", added: false },
  { id: "parent_father", name: "아빠", relation: "가족", tone: "#F6D6BD", char: "아", added: false },
  { id: "friend_jimin",  name: "김지민", relation: "친구", tone: "#D9D0E5", char: "지", added: false },
  { id: "acquaintance_junseo", name: "박준서", relation: "지인", tone: "#CDDCC8", char: "준", added: false },
];

type Step = "permission" | "add" | "invite";

export default function ContactsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("permission");
  const [contacts, setContacts] = useState<ContactItem[]>(MOCK_CONTACTS);
  const [customName, setCustomName] = useState("");
  const [customRelation, setCustomRelation] = useState<string>("친구");

  const addedContacts = contacts.filter(c => c.added);

  function toggleAdd(id: string) {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, added: !c.added } : c));
  }

  function addCustom() {
    if (!customName.trim()) return;
    const newContact: ContactItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      relation: customRelation,
      tone: "#F0E7D7",
      char: customName.trim().charAt(0),
      added: true,
    };
    setContacts(prev => [...prev, newContact]);
    setCustomName("");
  }

  function goToReminder() {
    localStorage.setItem("addedContacts", JSON.stringify(addedContacts.map(c => c.id)));
    router.push("/onboarding/reminder");
  }

  return (
    <AppScreen>
      <div style={{ background: "#FAF6EE", minHeight: "100vh", padding: "30px 26px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 }}>단계 1/3 · 챙길 사람</p>

        {/* ── 권한 요청 ─────────────────────────────────────────── */}
        {step === "permission" && (
          <>
            <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
              몇 가지 권한이 필요해요
            </h1>
            <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
              챙길 사람을 찾고 연락 타이밍을 맞추는 데 사용해요.
            </p>

            {/* 권한 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              {[
                {
                  name: "연락처",
                  desc: "챙길 사람을 연락처에서 바로 불러와요. 이름만 가져오고 전화번호는 저장하지 않아요.",
                  platforms: ["iOS", "Android"],
                  required: true,
                },
                {
                  name: "통화 기록",
                  desc: "마지막으로 연락한 날짜를 파악해 알림 타이밍을 맞춰요. 통화 내용은 접근하지 않아요.",
                  platforms: ["Android"],
                  required: false,
                },
                {
                  name: "알림",
                  desc: "연락하기 좋은 타이밍에 조용히 알려드려요. 언제든 설정에서 끌 수 있어요.",
                  platforms: ["iOS", "Android"],
                  required: false,
                },
                {
                  name: "사진 및 동영상",
                  desc: "대화에서 주고받은 사진을 참고해 대화 흐름을 기억하는 데 써요.",
                  platforms: ["Android"],
                  required: false,
                },
              ].map(p => (
                <div key={p.name} style={{
                  background: "#FFFBF2", border: "1px solid #E8DECF",
                  borderRadius: "16px", padding: "14px 16px",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <p style={{ fontSize: "15px", color: "#241E1A", margin: 0, fontWeight: 600 }}>
                        {p.name}
                      </p>
                      {p.required && (
                        <span style={{ fontSize: "11px", color: "#C0624A", fontWeight: 600, background: "#FDE8E2", borderRadius: "999px", padding: "2px 7px" }}>
                          필수
                        </span>
                      )}
                      <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
                        {p.platforms.map(pl => (
                          <span key={pl} style={{
                            fontSize: "11px", color: "#6E4A39", fontWeight: 500,
                            background: "#F6EDDB", borderRadius: "999px", padding: "2px 7px",
                          }}>
                            {pl}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 개인정보 안내 */}
            <div style={{ background: "#CDDCC8", borderRadius: "14px", padding: "14px 16px" }}>
              <p style={{ fontSize: "13px", color: "#241E1A", margin: "0 0 4px", fontWeight: 600 }}>
                수집하지 않는 것
              </p>
              <p style={{ fontSize: "13px", color: "#3D332C", margin: 0, lineHeight: 1.6 }}>
                전화번호 · 문자 내용 · 통화 내용 · 위치 정보
              </p>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep("add")}
                style={{
                  width: "100%", background: "#241E1A", color: "#FBF6EC",
                  border: "none", borderRadius: "999px", padding: "17px 22px",
                  fontSize: "16px", fontWeight: 500, cursor: "pointer",
                }}
              >
                권한 허용하고 시작하기
              </button>
              <button
                type="button"
                onClick={() => setStep("add")}
                style={{
                  background: "none", border: "none", fontSize: "14px",
                  color: "#8A6B5C", cursor: "pointer", padding: "4px",
                }}
              >
                나중에 직접 추가할게요
              </button>
            </div>
          </>
        )}

        {/* ── 사람 추가 ─────────────────────────────────────────── */}
        {step === "add" && (
          <>
            <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
              챙길 사람을 추가해요
            </h1>
            <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
              처음엔 한두 명만 추가해도 괜찮아요.
            </p>

            {/* 연락처 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {contacts.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleAdd(c.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: c.added ? "#F1E5C8" : "#FFFBF2",
                    border: c.added ? "1.5px solid #6E4A39" : "1px solid #E8DECF",
                    borderRadius: "18px", padding: c.added ? "13px 15px" : "14px 16px",
                    cursor: "pointer", width: "100%", textAlign: "left",
                  }}
                >
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "999px",
                    background: c.tone, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 600, color: "#241E1A",
                  }}>{c.char}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 600 }}>{c.name}</p>
                    <p style={{ fontSize: "12px", color: c.added ? "#6E4A39" : "#8A6B5C", margin: 0 }}>{c.relation}</p>
                  </div>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "999px",
                    border: `2px solid ${c.added ? "#6E4A39" : "#D5C9BB"}`,
                    background: c.added ? "#6E4A39" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {c.added && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 직접 추가 */}
            <div style={{ background: "#FFFBF2", border: "1.5px dashed #E8DECF", borderRadius: "18px", padding: "14px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>이름으로 직접 추가</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="이름 입력"
                  onKeyDown={e => { if (e.key === "Enter") addCustom(); }}
                  style={{
                    flex: 1, border: "1px solid #E8DECF", borderRadius: "999px",
                    padding: "10px 14px", fontSize: "14px", color: "#241E1A",
                    background: "#FAF6EE", outline: "none",
                  }}
                />
                <select
                  value={customRelation}
                  onChange={e => setCustomRelation(e.target.value)}
                  style={{
                    border: "1px solid #E8DECF", borderRadius: "999px",
                    padding: "10px 12px", fontSize: "13px", color: "#241E1A",
                    background: "#FAF6EE", outline: "none", cursor: "pointer",
                  }}
                >
                  {["가족", "친구", "지인"].map(r => <option key={r}>{r}</option>)}
                </select>
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!customName.trim()}
                  style={{
                    background: customName.trim() ? "#241E1A" : "#D5CFC8",
                    color: customName.trim() ? "#FBF6EC" : "#9A8B7D",
                    border: "none", borderRadius: "999px",
                    padding: "10px 16px", fontSize: "14px", fontWeight: 500,
                    cursor: customName.trim() ? "pointer" : "default",
                    whiteSpace: "nowrap",
                  }}
                >
                  추가
                </button>
              </div>
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => addedContacts.length > 0 ? setStep("invite") : goToReminder()}
                style={{
                  width: "100%", background: "#241E1A", color: "#FBF6EC",
                  border: "none", borderRadius: "999px", padding: "17px 22px",
                  fontSize: "16px", fontWeight: 500, cursor: "pointer",
                }}
              >
                {addedContacts.length > 0 ? `${addedContacts.length}명 추가 · 다음` : "나중에 추가할게요"}
              </button>
            </div>
          </>
        )}

        {/* ── 초대 ──────────────────────────────────────────────── */}
        {step === "invite" && (
          <>
            <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" }}>
              앱으로 초대할까요?
            </h1>
            <p style={{ fontSize: "15px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
              상대도 앱을 쓰면 알림을 주고받을 수 있어요.<br/>
              초대 안 해도 혼자 사용할 수 있어요.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {addedContacts.map(c => (
                <div key={c.id} style={{
                  background: "#FFFBF2", border: "1px solid #E8DECF",
                  borderRadius: "18px", padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "999px",
                    background: c.tone, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 600, color: "#241E1A",
                  }}>{c.char}</div>
                  <p style={{ flex: 1, fontSize: "16px", color: "#241E1A", margin: 0, fontWeight: 500 }}>{c.name}</p>
                  <button
                    type="button"
                    style={{
                      background: "#241E1A", color: "#FBF6EC",
                      border: "none", borderRadius: "999px",
                      padding: "8px 16px", fontSize: "13px", fontWeight: 500,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    카톡 초대
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#F6D6BD", borderRadius: "14px", padding: "14px" }}>
              <p style={{ fontSize: "13px", color: "#241E1A", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
                &quot;같이 써볼래? 부담 없이 안부 주고받는 앱이야 →&quot;
              </p>
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingTop: "24px" }}>
              <button
                type="button"
                onClick={goToReminder}
                style={{
                  width: "100%", background: "#241E1A", color: "#FBF6EC",
                  border: "none", borderRadius: "999px", padding: "17px 22px",
                  fontSize: "16px", fontWeight: 500, cursor: "pointer",
                }}
              >
                다음
              </button>
              <button
                type="button"
                onClick={goToReminder}
                style={{ background: "none", border: "none", fontSize: "14px", color: "#8A6B5C", cursor: "pointer", padding: "4px" }}
              >
                초대는 나중에 할게요
              </button>
            </div>
          </>
        )}
      </div>
    </AppScreen>
  );
}
