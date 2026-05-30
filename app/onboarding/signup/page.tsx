"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

// ── 상수 ─────────────────────────────────────────────────────────────────────

const YEARS  = Array.from({ length: 80 }, (_, i) => 2006 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }

const TERMS = [
  { id: "service",   label: "서비스 이용약관",      required: true },
  { id: "privacy",   label: "개인정보 처리방침",     required: true },
  { id: "age",       label: "만 14세 이상입니다",    required: true },
  { id: "marketing", label: "마케팅 알림 수신",     required: false },
];

// ── 유효성 검사 ──────────────────────────────────────────────────────────────

const idRegex  = /^[a-z0-9_]{4,20}$/;
const pwRegex  = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

function idHint(v: string) {
  if (!v) return null;
  if (v.length < 4)                   return "4자 이상 입력해주세요";
  if (!/^[a-z0-9_]+$/.test(v))        return "영문 소문자, 숫자, 밑줄만 사용할 수 있어요";
  if (v.length > 20)                  return "20자 이하로 입력해주세요";
  return "ok";
}

function pwHint(v: string) {
  if (!v) return null;
  if (v.length < 8)          return "8자 이상 입력해주세요";
  if (!/[a-zA-Z]/.test(v))   return "영문을 포함해주세요";
  if (!/[0-9]/.test(v))      return "숫자를 포함해주세요";
  return "ok";
}

// ── 페이지 ───────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();

  const [name,    setName]    = useState("");
  const [userId,  setUserId]  = useState("");
  const [pw,      setPw]      = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [showPwC, setShowPwC] = useState(false);

  const [year,  setYear]  = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day,   setDay]   = useState<number | null>(null);

  const [agreed, setAgreed] = useState<Record<string, boolean>>(
    Object.fromEntries(TERMS.map(t => [t.id, false]))
  );

  // 입력 후에만 에러 표시
  const [touched, setTouch] = useState({ userId: false, pw: false, pwCheck: false });
  const touch = (k: keyof typeof touched) => setTouch(p => ({ ...p, [k]: true }));

  const days = year && month ? Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1) : [];

  const idStatus  = idHint(userId);
  const pwStatus  = pwHint(pw);
  const pwMatch   = pwCheck.length > 0 && pw === pwCheck;
  const pwMismatch = pwCheck.length > 0 && pw !== pwCheck;

  const allRequired = TERMS.filter(t => t.required).every(t => agreed[t.id]);
  const allChecked  = TERMS.every(t => agreed[t.id]);

  const canSubmit =
    name.trim().length > 0 &&
    idRegex.test(userId) &&
    pwRegex.test(pw) &&
    pw === pwCheck &&
    allRequired;

  function toggleAll() {
    const next = !allChecked;
    setAgreed(Object.fromEntries(TERMS.map(t => [t.id, next])));
  }

  function submit() {
    if (!canSubmit) return;
    localStorage.setItem("userName",  name.trim());
    localStorage.setItem("userId",    userId);
    if (year && month && day)
      localStorage.setItem("userBirthday", `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
    localStorage.setItem("agreedMarketing", String(agreed.marketing));
    router.push("/onboarding/contacts");
  }

  return (
    <AppScreen>
      <div style={{
        background: "#FAF6EE", minHeight: "100vh",
        padding: "36px 26px 48px",
        display: "flex", flexDirection: "column", gap: "12px",
      }}>

        {/* ── 헤더 ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: "6px" }}>
          <p style={eyebrow}>회원가입</p>
          <h1 style={heading}>반갑습니다</h1>
          <p style={sub}>아래 정보로 시작해요.</p>
        </div>

        {/* ── 이름 ──────────────────────────────────────────────── */}
        <FieldCard focused={name.length > 0}>
          <FieldLabel>이름 <Req /></FieldLabel>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="김민권"
            autoComplete="name"
            style={bigInput}
          />
        </FieldCard>

        {/* ── 계정 정보 ──────────────────────────────────────────── */}
        <div style={plainCard}>
          {/* 아이디 */}
          <div style={{ paddingBottom: "14px", borderBottom: "1px solid #F0E7D7" }}>
            <FieldLabel>아이디 <Req /></FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value.toLowerCase())}
                onBlur={() => touch("userId")}
                placeholder="영문 소문자, 숫자, 밑줄"
                autoComplete="username"
                style={lineInput}
              />
              {touched.userId && idStatus === "ok" && <StatusDot ok />}
            </div>
            {touched.userId && idStatus && idStatus !== "ok" && (
              <p style={errText}>{idStatus}</p>
            )}
            {(!touched.userId || idStatus === "ok") && (
              <p style={hintText}>4~20자 · 영문 소문자, 숫자, 밑줄(_)</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div style={{ paddingTop: "14px", paddingBottom: "14px", borderBottom: "1px solid #F0E7D7" }}>
            <FieldLabel>비밀번호 <Req /></FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={e => setPw(e.target.value)}
                onBlur={() => touch("pw")}
                placeholder="8자 이상"
                autoComplete="new-password"
                style={{ ...lineInput, flex: 1 }}
              />
              <EyeButton show={showPw} onToggle={() => setShowPw(p => !p)} />
              {touched.pw && pwStatus === "ok" && <StatusDot ok />}
            </div>
            {touched.pw && pwStatus && pwStatus !== "ok" && (
              <p style={errText}>{pwStatus}</p>
            )}
            {(!touched.pw || pwStatus === "ok") && (
              <p style={hintText}>영문 + 숫자 포함 8자 이상</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ paddingTop: "14px" }}>
            <FieldLabel>비밀번호 확인 <Req /></FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <input
                type={showPwC ? "text" : "password"}
                value={pwCheck}
                onChange={e => setPwCheck(e.target.value)}
                onBlur={() => touch("pwCheck")}
                placeholder="비밀번호를 다시 입력해요"
                autoComplete="new-password"
                style={{ ...lineInput, flex: 1 }}
              />
              <EyeButton show={showPwC} onToggle={() => setShowPwC(p => !p)} />
              {pwMatch   && <StatusDot ok />}
              {pwMismatch && <StatusDot ok={false} />}
            </div>
            {pwMismatch && <p style={errText}>비밀번호가 일치하지 않아요</p>}
            {pwMatch    && <p style={{ ...hintText, color: "#6B8A6B" }}>비밀번호가 일치해요</p>}
          </div>
        </div>

        {/* ── 생년월일 (선택) ───────────────────────────────────── */}
        <div style={plainCard}>
          <FieldLabel>생년월일 <span style={{ color: "#9A8B7D", fontWeight: 400 }}>(선택)</span></FieldLabel>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <select value={year ?? ""} onChange={e => { setYear(Number(e.target.value)); setDay(null); }} style={{ ...sel, flex: 2 }}>
              <option value="">년도</option>
              {YEARS.map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select value={month ?? ""} onChange={e => { setMonth(Number(e.target.value)); setDay(null); }} style={{ ...sel, flex: 1 }}>
              <option value="">월</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
            </select>
            <select value={day ?? ""} onChange={e => setDay(Number(e.target.value))} disabled={days.length === 0} style={{ ...sel, flex: 1, opacity: days.length === 0 ? 0.4 : 1 }}>
              <option value="">일</option>
              {days.map(d => <option key={d} value={d}>{d}일</option>)}
            </select>
          </div>
          <p style={hintText}>연락 타이밍 추천에 쓰여요. 외부에 공개되지 않아요.</p>
        </div>

        {/* ── 약관 동의 ──────────────────────────────────────────── */}
        <div style={plainCard}>
          <FieldLabel>약관 동의</FieldLabel>

          {/* 전체 동의 */}
          <button type="button" onClick={toggleAll} style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: allChecked ? "#F1E5C8" : "#FAF6EE",
            border: `1.5px solid ${allChecked ? "#6E4A39" : "#E8DECF"}`,
            borderRadius: "12px", padding: "12px 14px",
            cursor: "pointer", width: "100%", textAlign: "left",
            margin: "8px 0 10px",
          }}>
            <Checkbox checked={allChecked} />
            <span style={{ fontSize: "15px", color: "#241E1A", fontWeight: 600 }}>전체 동의</span>
          </button>

          {/* 구분선 */}
          <div style={{ height: "1px", background: "#F0E7D7", marginBottom: "6px" }} />

          {TERMS.map(t => (
            <button key={t.id} type="button" onClick={() => setAgreed(p => ({ ...p, [t.id]: !p[t.id] }))} style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "none", border: "none",
              padding: "8px 4px", cursor: "pointer", width: "100%", textAlign: "left",
            }}>
              <Checkbox checked={agreed[t.id]} />
              <span style={{ flex: 1, fontSize: "14px", color: "#241E1A" }}>
                <span style={{ color: t.required ? "#C0624A" : "#9A8B7D", fontWeight: 600, marginRight: "4px", fontSize: "12px" }}>
                  {t.required ? "[필수]" : "[선택]"}
                </span>
                {t.label}
              </span>
              {t.id !== "age" && (
                <span style={{ fontSize: "12px", color: "#B8A99A", textDecoration: "underline" }}>보기</span>
              )}
            </button>
          ))}
        </div>

        {/* ── 제출 ──────────────────────────────────────────────── */}
        <div style={{ paddingTop: "4px" }}>
          <button type="button" onClick={submit} disabled={!canSubmit} style={{
            width: "100%",
            background: canSubmit ? "#241E1A" : "#D5CFC8",
            color: canSubmit ? "#FBF6EC" : "#9A8B7D",
            border: "none", borderRadius: "999px",
            padding: "17px 22px", fontSize: "16px", fontWeight: 500,
            cursor: canSubmit ? "pointer" : "default",
            letterSpacing: "-0.012em",
          }}>
            가입하기
          </button>
          <p style={{ fontSize: "13px", color: "#8A6B5C", textAlign: "center", margin: "14px 0 0" }}>
            이미 계정이 있어요 ·{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>로그인</span>
          </p>
        </div>

      </div>
    </AppScreen>
  );
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function FieldCard({ children, focused }: { children: React.ReactNode; focused?: boolean }) {
  return (
    <div style={{
      background: "#FFFBF2",
      border: `1px solid ${focused ? "#241E1A" : "#E8DECF"}`,
      borderRadius: "18px", padding: "16px 18px",
      transition: "border-color 0.15s",
    }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 2px", fontWeight: 500 }}>{children}</p>;
}

function Req() {
  return <span style={{ color: "#C0624A", marginLeft: "1px" }}>*</span>;
}

function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={{ background: "none", border: "none", padding: "2px", cursor: "pointer", flexShrink: 0, color: "#8A6B5C" }}>
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <div style={{
      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
      background: ok ? "#6B8A6B" : "#C0624A",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {ok ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0,
      background: checked ? "#241E1A" : "transparent",
      border: checked ? "none" : "1.5px solid #D5C9BB",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 3.5L4 6.5L10 1" stroke="#FBF6EC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// ── 스타일 상수 ──────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = { fontSize: "12.5px", color: "#8A6B5C", margin: "0 0 4px", fontWeight: 500 };
const heading: React.CSSProperties = { fontSize: "28px", color: "#241E1A", margin: "0 0 4px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.03em" };
const sub: React.CSSProperties     = { fontSize: "15px", color: "#8A6B5C", margin: 0, lineHeight: 1.5 };
const bigInput: React.CSSProperties = { width: "100%", border: "none", outline: "none", fontSize: "22px", color: "#241E1A", fontWeight: 500, background: "transparent", padding: 0 };
const lineInput: React.CSSProperties = { flex: 1, border: "none", borderBottom: "1px solid #E8DECF", outline: "none", fontSize: "16px", color: "#241E1A", background: "transparent", padding: "4px 0", width: "100%" };
const plainCard: React.CSSProperties = { background: "#FFFBF2", border: "1px solid #E8DECF", borderRadius: "18px", padding: "16px 18px" };
const hintText: React.CSSProperties  = { fontSize: "12px", color: "#9A8B7D", margin: "6px 0 0", lineHeight: 1.4 };
const errText: React.CSSProperties   = { fontSize: "12px", color: "#C0624A", margin: "6px 0 0", lineHeight: 1.4 };
const sel: React.CSSProperties = { background: "#FAF6EE", border: "1px solid #E8DECF", borderRadius: "12px", padding: "10px", fontSize: "14px", color: "#241E1A", outline: "none", cursor: "pointer", appearance: "none" };
