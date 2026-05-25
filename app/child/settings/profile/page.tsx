"use client";

import { useState } from "react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { childProfile, demoDataset } from "@/lib/mockData";

const PARENT_TONES = ["#F1D6CC", "#CDDCC8"];

export default function ProfilePage() {
  const [name, setName] = useState(childProfile.name);
  const [saved, setSaved] = useState(false);

  return (
    <DetailScreen title="프로필 수정">
      {/* 프로필 이미지 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "999px",
            background: "#F1D6CC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px"
          }}
        >
          👤
        </div>
      </div>

      {/* 기본 정보 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 14px", fontWeight: 500 }}>기본 정보</p>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", color: "#8A6B5C", display: "block", marginBottom: "6px" }}>이름</label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            style={{
              width: "100%",
              border: "1px solid #E8DECF",
              borderRadius: "16px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#241E1A",
              background: "#FAF6EE",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box"
            }}
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", color: "#8A6B5C", display: "block", marginBottom: "6px" }}>역할</label>
          <p
            style={{
              border: "1px solid #E8DECF",
              borderRadius: "16px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#9A8B7D",
              background: "#FAF6EE",
              margin: 0
            }}
          >
            자녀
          </p>
        </div>
        <div>
          <label style={{ fontSize: "13px", color: "#8A6B5C", display: "block", marginBottom: "6px" }}>나이</label>
          <p
            style={{
              border: "1px solid #E8DECF",
              borderRadius: "16px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#9A8B7D",
              background: "#FAF6EE",
              margin: 0
            }}
          >
            {childProfile.age}세
          </p>
        </div>
      </div>

      {/* 연결된 부모님 */}
      <div
        style={{
          background: "#FFFBF2",
          borderRadius: "26px",
          padding: "18px",
          border: "1px solid #E8DECF",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#8A6B5C", margin: "0 0 12px", fontWeight: 500 }}>연결된 부모님</p>
        {demoDataset.parents.map((parent, idx) => (
          <div
            key={parent.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              borderBottom: idx < demoDataset.parents.length - 1 ? "1px solid #F0E7D7" : "none"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                background: PARENT_TONES[idx] ?? "#F0E7D7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "18px"
              }}
            >
              {parent.role === "mother" ? "👩" : "👨"}
            </div>
            <div>
              <p style={{ fontSize: "15px", color: "#241E1A", margin: "0 0 2px", fontWeight: 500 }}>
                {parent.displayName}
              </p>
              <p style={{ fontSize: "12px", color: "#8A6B5C", margin: 0 }}>
                {parent.role === "mother" ? "어머니" : "아버지"} · {parent.age}세
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 저장 버튼 */}
      <button
        type="button"
        onClick={() => setSaved(true)}
        style={{
          width: "100%",
          background: saved ? "#CDDCC8" : "#241E1A",
          color: saved ? "#241E1A" : "#FBF6EC",
          border: "none",
          borderRadius: "999px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {saved ? "저장됐어요 ✓" : "변경사항 저장"}
      </button>
    </DetailScreen>
  );
}
