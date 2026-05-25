import { cn } from "@/lib/utils";

export function ScreenHeader({
  eyebrow,
  title,
  description,
  className,
  large = false
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  large?: boolean;
}) {
  return (
    <header className={cn("mb-5", className)}>
      <p
        className={cn("mb-1.5 font-medium", large ? "text-[15px]" : "text-[12.5px]")}
        style={{ color: "#8A6B5C", letterSpacing: "-0.005em" }}
      >
        {eyebrow}
      </p>
      <h1
        className={cn("font-bold leading-tight", large ? "text-[32px]" : "text-[28px]")}
        style={{ color: "#241E1A", letterSpacing: "-0.03em", lineHeight: 1.25 }}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn("mt-2 leading-relaxed", large ? "text-[17px]" : "text-[14px]")}
          style={{ color: "#8A6B5C", letterSpacing: "-0.005em" }}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
