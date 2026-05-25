"use client";

import { DetailScreen } from "@/components/child/DetailScreen";
import { useSelectedParent } from "@/contexts/SelectedParentContext";

const CHANNEL_LABEL: Record<string, string> = {
  text: "문자",
  call: "통화",
  photo: "사진",
  video: "영상통화",
  missed: "부재중"
};

const CHANNEL_COLOR: Record<string, { bg: string; dot: string }> = {
  text: { bg: "#FBF6F0", dot: "#E07856" },
  call: { bg: "#E8F3E5", dot: "#7AB87A" },
  photo: { bg: "#FFF1DA", dot: "#E8A04E" },
  video: { bg: "#E0EDF5", dot: "#7DA8C8" },
  missed: { bg: "#F5F0F5", dot: "#C5A898" }
};

const SENTIMENT_TAG: Record<string, string> = {
  warm: "😊",
  neutral: "😐",
  concerned: "😟",
  missed: "📵"
};

export default function ContactHistoryPage() {
  const { parentProfile } = useSelectedParent();
  const records = [...parentProfile.contactRecords30Days].reverse();

  // 날짜별 그룹핑
  const grouped = records.reduce<Record<string, typeof records>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <DetailScreen title="연락 기록" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      <p style={{ fontSize: "13px", color: "#8A6B5C", margin: "0 0 20px", lineHeight: 1.5 }}>
        {parentProfile.displayName}와 나눈 최근 30일 연락 기록이에요.
      </p>

      {dates.map((date) => {
        const items = grouped[date];
        const [, mm, dd] = date.split("-");
        return (
          <div key={date} style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "12px",
                color: "#B07A5C",
                fontWeight: 600,
                margin: "0 0 8px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#E07856",
                  display: "inline-block"
                }}
              />
              {parseInt(mm)}월 {parseInt(dd)}일
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((record) => {
                const colors = CHANNEL_COLOR[record.channel] ?? CHANNEL_COLOR.text;
                return (
                  <div
                    key={record.id}
                    style={{
                      background: colors.bg,
                      borderRadius: "14px",
                      padding: "12px 14px",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start"
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: colors.dot,
                        flexShrink: 0,
                        marginTop: "5px"
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", color: "#B07A5C", fontWeight: 500 }}>
                          {CHANNEL_LABEL[record.channel] ?? record.channel}
                          {record.durationMinutes ? ` · ${record.durationMinutes}분` : ""}
                        </span>
                        <span style={{ fontSize: "13px" }}>{SENTIMENT_TAG[record.sentiment]}</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "#3D2419", margin: 0, lineHeight: 1.5 }}>{record.summary}</p>
                      {record.responseLatencyMinutes && (
                        <p style={{ fontSize: "11px", color: "#B07A5C", margin: "4px 0 0" }}>
                          답장까지 {record.responseLatencyMinutes}분
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </DetailScreen>
  );
}
