"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChildAppShell } from "@/components/child/ChildAppShell";
import { GreetingModal } from "@/components/child/GreetingModal";
import { useSelectedParent } from "@/contexts/SelectedParentContext";
import { demoDataset, pendingReplyMessages } from "@/lib/mockData";
import { calculateRelationshipTemperature } from "@/lib/relationshipEngine";
import type { ContactRecord } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function getDaysSinceContact(records: ContactRecord[]): number {
  if (!records.length) return 99;
  const latest = records.reduce((a, b) => (a.date > b.date ? a : b));
  const today = new Date().toISOString().slice(0, 10);
  const ref = new Date(today);
  const last = new Date(latest.date);
  return Math.max(0, Math.floor((ref.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)));
}

const CH_LABEL: Record<string, string> = {
  call: "통화", text: "문자", photo: "사진", video: "영상통화", missed: "부재중"
};

function formatFamilyStatus(records: ContactRecord[]): { text: string; stale: boolean } {
  if (!records.length) return { text: "연락 기록이 없어요", stale: true };
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const ch = CH_LABEL[sorted[0].channel] ?? "연락";
  const days = getDaysSinceContact(records);
  if (days === 0) return { text: `오늘 ${ch}했어요`, stale: false };
  if (days === 1) return { text: `어제 ${ch}했어요`, stale: false };
  if (days >= 7) return { text: `${days}일째 소식이 없어요`, stale: true };
  return { text: `${days}일 전 ${ch}했어요`, stale: false };
}

// ── atoms ─────────────────────────────────────────────────────────────────────

function Avatar({ char, tone = "#F1D6CC", size = 44 }: { char: string; tone?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: tone,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.42), fontWeight: 700, color: "#241E1A",
      letterSpacing: "-0.02em", flexShrink: 0,
    }}>
      {char}
    </div>
  );
}

function ArrowIcon({ color = "#FBF6EC", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── FamilyRow ─────────────────────────────────────────────────────────────────

function FamilyRow({
  avatar, tone, name, status, stale, temperature, onClick, divider,
}: {
  avatar: string; tone: string; name: string;
  status: string; stale: boolean;
  temperature: number; onClick: () => void; divider?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
        width: "100%", textAlign: "left", background: "none", border: "none",
        borderBottom: divider ? "1px solid #F0E7D7" : "none",
        cursor: "pointer",
      }}
    >
      <Avatar char={avatar} tone={tone} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.015em", color: "#241E1A" }}>
            {name}
          </span>
          {stale && (
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#F0C2AC", flexShrink: 0, display: "inline-block" }} />
          )}
        </div>
        <div style={{ fontSize: "13px", color: "#8A6B5C", marginTop: 2, letterSpacing: "-0.005em" }}>
          {status}
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#8A6B5C", fontWeight: 500, letterSpacing: "-0.005em", flexShrink: 0 }}>
        {temperature.toFixed(1)}°
      </div>
      <div style={{ marginLeft: 4, color: "#6E4A39", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 11l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

// ── Chip ──────────────────────────────────────────────────────────────────────

function Chip({ children, tone, onClick }: { children: React.ReactNode; tone: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, padding: "12px 18px", borderRadius: 999,
        background: tone, border: "none", cursor: "pointer",
        fontSize: "14px", fontWeight: 600, letterSpacing: "-0.012em",
        color: "#241E1A", display: "inline-flex", alignItems: "center", gap: 4,
      }}
    >
      {children}
    </button>
  );
}

// ── constants ─────────────────────────────────────────────────────────────────

const PARENT_TONES: Record<string, string> = {
  parent_mother: "#F1D6CC",
  parent_father: "#F1E5C8",
};

const PARENT_CHARS: Record<string, string> = {
  parent_mother: "엄",
  parent_father: "아",
};

// ── page ──────────────────────────────────────────────────────────────────────

export default function ChildHomePage() {
  const router = useRouter();
  const { selectedParentId, setSelectedParentId } = useSelectedParent();
  const [modalTopic, setModalTopic] = useState<string | null>(null);
  const [modalIncomingMessage, setModalIncomingMessage] = useState<string | undefined>(undefined);

  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
  const referenceDate = demoDataset.generatedAt;

  const pendingReplies = pendingReplyMessages.filter((m) => !m.isReplied);
  const firstPending = pendingReplies[0] ?? null;

  const familyRows = demoDataset.parents.map((parent) => {
    const temp = calculateRelationshipTemperature(parent.id, demoDataset, referenceDate);
    const { text: status, stale } = formatFamilyStatus(parent.contactRecords30Days ?? []);
    return {
      parentId: parent.id,
      name: parent.displayName,
      temperature: temp.temperature,
      status,
      stale,
    };
  });

  function handleParentClick(parentId: string) {
    setSelectedParentId(parentId as "parent_mother" | "parent_father");
    router.push("/child/home/temperature");
  }

  return (
    <ChildAppShell>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0, fontWeight: 500, letterSpacing: "-0.005em" }}>
          {today}
        </p>
        <div style={{
          width: "36px", height: "36px", borderRadius: 999,
          border: "1px solid #E8DECF", background: "#FFFBF2",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="2.6" stroke="#241E1A" strokeWidth="1.4"/>
            <path d="M3 13.5c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2" stroke="#241E1A" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <h1 style={{
        fontSize: "30px", lineHeight: 1.22, fontWeight: 700, letterSpacing: "-0.03em",
        margin: "14px 0 26px", color: "#241E1A",
      }}>
        오늘, 한 번 더<br/>가까워져요
      </h1>

      {/* ── 히어로: 미답장 있을 때 ── */}
      {firstPending ? (
        <div style={{ position: "relative", paddingLeft: "16px", marginBottom: "28px" }}>
          <div style={{
            position: "absolute", left: 0, top: 6, bottom: 56,
            width: 3, borderRadius: 999, background: "#F6D6BD",
          }} />

          {/* 발신자 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Avatar
              char={firstPending.parentDisplayName.charAt(0)}
              tone={PARENT_TONES[firstPending.parentId] ?? "#F1D6CC"}
              size={36}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.015em", color: "#241E1A" }}>
                {firstPending.parentDisplayName}
              </span>
              <span style={{ fontSize: "12px", color: "#8A6B5C" }}>오늘 · 카카오톡</span>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: "11px", color: "#6E4A39", fontWeight: 600,
              background: "#F6D6BD", padding: "4px 10px", borderRadius: 999, letterSpacing: "-0.005em",
              flexShrink: 0,
            }}>
              답장 대기
            </span>
          </div>

          {/* 메시지 */}
          <div style={{
            fontSize: "22px", fontWeight: 600, lineHeight: 1.5, letterSpacing: "-0.02em",
            color: "#241E1A", marginBottom: 12,
          }}>
            "{firstPending.message}"
          </div>

          {firstPending.context && (
            <div style={{ fontSize: "13px", color: "#8A6B5C", lineHeight: 1.55, marginBottom: 18 }}>
              {firstPending.context}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setModalIncomingMessage(firstPending.message);
              setModalTopic("답장");
            }}
            style={{
              width: "100%", background: "#241E1A", color: "#FBF6EC",
              border: "none", borderRadius: 999,
              padding: "17px 22px", fontSize: "16px", fontWeight: 500,
              cursor: "pointer", letterSpacing: "-0.012em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <span>답장 보내기</span>
            <ArrowIcon />
          </button>
        </div>
      ) : (
        /* ── 히어로: 미답장 없을 때 ── */
        <div style={{ position: "relative", paddingLeft: "16px", marginBottom: "28px" }}>
          <div style={{
            position: "absolute", left: 0, top: 4, bottom: 56,
            width: 3, borderRadius: 999, background: "#D8E0A6",
          }} />
          <div style={{
            fontSize: "12px", fontWeight: 600, color: "#6E4A39",
            marginBottom: 8, letterSpacing: "-0.005em",
          }}>
            오늘 보내기 좋은 안부
          </div>
          <div style={{
            fontSize: "20px", fontWeight: 600, lineHeight: 1.45, letterSpacing: "-0.02em",
            color: "#241E1A", marginBottom: 10,
          }}>
            오늘 날씨가 좋아서<br/>산책 이야기를 꺼내기 좋아요.
          </div>
          <div style={{ fontSize: "13px", color: "#8A6B5C", lineHeight: 1.5, marginBottom: 18 }}>
            날씨와 평소 대화 흐름을 참고했어요.
          </div>
          <button
            type="button"
            onClick={() => { setModalIncomingMessage(undefined); setModalTopic("요즘"); }}
            style={{
              width: "100%", background: "#241E1A", color: "#FBF6EC",
              border: "none", borderRadius: 999,
              padding: "17px 22px", fontSize: "16px", fontWeight: 500,
              cursor: "pointer", letterSpacing: "-0.012em",
            }}
          >
            안부 추천 보기
          </button>
        </div>
      )}

      {/* ── 가족 섹션 ── */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: "4px",
        }}>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
            가족
          </span>
          <span style={{ fontSize: "12px", color: "#8A6B5C" }}>{familyRows.length}명</span>
        </div>
        {familyRows.map((p, idx) => (
          <FamilyRow
            key={p.parentId}
            avatar={PARENT_CHARS[p.parentId] ?? p.name.charAt(0)}
            tone={PARENT_TONES[p.parentId] ?? "#F1D6CC"}
            name={p.name}
            status={p.status}
            stale={p.stale}
            temperature={p.temperature}
            divider={idx < familyRows.length - 1}
            onClick={() => handleParentClick(p.parentId)}
          />
        ))}
      </div>

      {/* ── 오늘의 안부 칩 레일 ── */}
      <div>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: "12px",
        }}>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "#241E1A" }}>
            오늘의 안부
          </span>
          <span style={{ fontSize: "12px", color: "#8A6B5C" }}>탭하면 다듬어드려요</span>
        </div>
        <div style={{
          display: "flex", gap: "8px", overflowX: "auto",
          marginLeft: "-22px", marginRight: "-22px",
          padding: "4px 22px 8px",
          scrollbarWidth: "none",
        } as React.CSSProperties}>
          <Chip tone="#D8E0A6" onClick={() => { setModalIncomingMessage(undefined); setModalTopic("날씨"); }}>🌤 날씨</Chip>
          <Chip tone="#D9D0E5" onClick={() => { setModalIncomingMessage(undefined); setModalTopic("산책"); }}>🚶 산책</Chip>
          <Chip tone="#CDDCC8" onClick={() => { setModalIncomingMessage(undefined); setModalTopic("식사"); }}>🥣 식사</Chip>
          <Chip tone="#F6D6BD" onClick={() => { setModalIncomingMessage(undefined); setModalTopic("사진"); }}>📷 사진</Chip>
          <Chip tone="#F1D6CC" onClick={() => { setModalIncomingMessage(undefined); setModalTopic("요즘"); }}>💬 요즘</Chip>
        </div>
      </div>
      <GreetingModal
        topic={modalTopic}
        parentId={selectedParentId}
        incomingMessage={modalIncomingMessage}
        onClose={() => { setModalTopic(null); setModalIncomingMessage(undefined); }}
      />
    </ChildAppShell>
  );
}
