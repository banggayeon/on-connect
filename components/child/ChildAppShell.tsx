import { BottomTabBar } from "@/components/BottomTabBar";
import { AppScreen } from "@/components/AppScreen";

export function ChildAppShell({
  children,
  className = "bg-gradient-to-b from-[#FFEDE0] via-cream-50 to-white"
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppScreen className={className}>
      <div className="min-h-screen px-[22px] py-[28px]">
        {children}
        <BottomTabBar />
      </div>
    </AppScreen>
  );
}
