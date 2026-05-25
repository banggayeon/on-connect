import Link from "next/link";
import { AppScreen } from "@/components/AppScreen";

export default function NotFound() {
  return (
    <AppScreen>
      <div
        style={{
          minHeight: "100vh",
          padding: "32px 24px",
          background: "#FAF6EE",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "14px", color: "#8A6B5C", margin: "0 0 8px", fontWeight: 500 }}>길을 찾지 못했어요</p>
        <h1 style={{ fontSize: "28px", color: "#241E1A", margin: "0 0 12px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em" }}>
          온(溫) 커넥트로
          <br />
          다시 시작해요
        </h1>
        <p style={{ fontSize: "16px", color: "#8A6B5C", margin: "0 0 24px", lineHeight: 1.6 }}>
          존재하지 않는 화면이에요.
          <br />
          온보딩 시작 화면으로 돌아갈 수 있어요.
        </p>
        <Link
          href="/onboarding/welcome"
          style={{
            display: "block",
            background: "#241E1A",
            borderRadius: "999px",
            padding: "16px",
            color: "#FBF6EC",
            fontSize: "17px",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          시작 화면으로 가기
        </Link>
      </div>
    </AppScreen>
  );
}
