"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppScreen } from "@/components/AppScreen";

export function DetailScreen({
  title,
  children,
  className = "bg-gradient-to-b from-[#FBF6F0] to-white",
  rightElement
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AppScreen className={className}>
      {/* 상단 헤더 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(251,246,240,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(240,228,216,0.6)"
        }}
      >
        <div
          style={{
            maxWidth: "430px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px"
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "white",
              border: "1px solid #F0E4D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(61,36,25,0.06)"
            }}
          >
            <ArrowLeft size={18} style={{ color: "#5F4534" }} />
          </button>
          <h1 style={{ flex: 1, fontSize: "17px", color: "#3D2419", fontWeight: 600, margin: 0 }}>{title}</h1>
          {rightElement}
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: "20px 22px 80px" }}>{children}</div>
    </AppScreen>
  );
}
