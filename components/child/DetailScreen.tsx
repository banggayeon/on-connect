"use client";

import { useRouter } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";

export function DetailScreen({
  title,
  children,
  rightElement
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AppScreen>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(250,246,238,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #F0E7D7"
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
              borderRadius: "999px",
              background: "#FFFBF2",
              border: "1px solid #E8DECF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 13L7 9L11 5" stroke="#3D332C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{ flex: 1, fontSize: "17px", color: "#241E1A", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
          {rightElement}
        </div>
      </div>

      <div style={{ padding: "20px 22px 80px" }}>{children}</div>
    </AppScreen>
  );
}
