import { AppScreen } from "@/components/AppScreen";
import { ParentTabBar } from "./ParentTabBar";

export function ParentAppShell({
  children,
  noPadding = false
}: {
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <AppScreen>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: noPadding ? "0" : "28px 26px 0"
        }}
      >
        {children}
        <ParentTabBar />
      </div>
    </AppScreen>
  );
}
