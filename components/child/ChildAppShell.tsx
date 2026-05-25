import { BottomTabBar } from "@/components/BottomTabBar";
import { AppScreen } from "@/components/AppScreen";

export function ChildAppShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppScreen>
      <div style={{ minHeight: "100vh", padding: "28px 22px 0" }}>
        {children}
        <BottomTabBar />
      </div>
    </AppScreen>
  );
}
