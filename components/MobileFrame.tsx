import { StatusBar } from "@/components/StatusBar";
import { cn } from "@/lib/utils";

type MobileFrameProps = {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  showStatus?: boolean;
};

export function MobileFrame({
  children,
  className,
  screenClassName,
  showStatus = true
}: MobileFrameProps) {
  return (
    <main className={cn("min-h-dvh px-4 py-6 sm:py-8", className)} style={{ background: "#F6EDDB" }}>
      <div className="mx-auto w-full max-w-[410px]">
        <div className="rounded-[34px] p-1.5 shadow-phone" style={{ background: "#241E1A" }}>
          <section
            className={cn(
              "relative min-h-[820px] overflow-hidden rounded-[28px] px-5 pb-6 pt-4",
              screenClassName
            )}
            style={{ background: "#FAF6EE" }}
          >
            {showStatus ? <StatusBar /> : null}
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
