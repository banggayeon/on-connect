import { cn } from "@/lib/utils";

export function AppScreen({
  children,
  className,
  style
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <main
      className={cn("min-h-screen w-full", className)}
      style={{
        background: "#FAF6EE",
        fontFamily: "var(--font-sans)",
        color: "#241E1A",
        ...style
      }}
    >
      <div
        className="app-screen-content"
        style={{
          width: "100%",
          maxWidth: "430px",
          minHeight: "100vh",
          margin: "0 auto"
        }}
      >
        {children}
      </div>
    </main>
  );
}
