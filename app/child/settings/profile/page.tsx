"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { DetailScreen } from "@/components/child/DetailScreen";
import { childProfile, demoDataset } from "@/lib/mockData";

export default function ProfilePage() {
  const [name, setName] = useState(childProfile.name);
  const [saved, setSaved] = useState(false);

  return (
    <DetailScreen title="프로필 수정" className="bg-gradient-to-b from-[#FBF6F0] to-white">
      {/* 프로필 이미지 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
          }}
        >
          <User size={36} style={{ color: "white" }} />
        </div>
      </div>

      {/* 기본 정보 */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "14px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 14px", fontWeight: 500 }}>기본 정보</p>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", color: "#8A6B5C", display: "block", marginBottom: "6px" }}>이름</label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            style={{
              width: "100%",
              border: "1.5px solid #F0E4D8",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#3D2419",
              background: "#FBF6F0",
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
              border: "1.5px solid #F0E4D8",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#B07A5C",
              background: "#FBF6F0",
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
              border: "1.5px solid #F0E4D8",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "15px",
              color: "#B07A5C",
              background: "#FBF6F0",
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
          background: "white",
          borderRadius: "18px",
          padding: "18px",
          boxShadow: "0 2px 10px rgba(61,36,25,0.05)",
          marginBottom: "20px"
        }}
      >
        <p style={{ fontSize: "12px", color: "#B07A5C", margin: "0 0 12px", fontWeight: 500 }}>연결된 부모님</p>
        {demoDataset.parents.map((parent) => (
          <div
            key={parent.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              borderBottom: "1px solid #F5EDE6"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: parent.role === "mother"
                  ? "linear-gradient(135deg, #FFB088, #FF8A65)"
                  : "linear-gradient(135deg, #FFD9B8, #E8A04E)",
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
              <p style={{ fontSize: "15px", color: "#3D2419", margin: "0 0 2px", fontWeight: 500 }}>
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
          background: "linear-gradient(135deg, #FF8A65, #E07856)",
          color: "white",
          border: "none",
          borderRadius: "16px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(224,120,86,0.28)"
        }}
      >
        {saved ? "저장됐어요 ✓" : "변경사항 저장"}
      </button>
    </DetailScreen>
  );
}
