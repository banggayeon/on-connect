import Link from "next/link";
import { AppScreen } from "@/components/AppScreen";

export default function NotFound() {
  return (
    <AppScreen>
      <div
        style={{
          minHeight: "100vh",
          padding: "32px 24px",
          background: "linear-gradient(180deg, #FFEDE0 0%, #FFF8F0 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "14px", color: "#B07A5C", margin: "0 0 8px", fontWeight: 500 }}>길을 찾지 못했어요</p>
        <h1 style={{ fontSize: "28px", color: "#3D2419", margin: "0 0 12px", fontWeight: 500, lineHeight: 1.3 }}>
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
            background: "linear-gradient(135deg, #FF8A65, #E07856)",
            borderRadius: "16px",
            padding: "16px",
            color: "white",
            fontSize: "17px",
            fontWeight: 500
          }}
        >
          시작 화면으로 가기
        </Link>
      </div>
    </AppScreen>
  );
}
