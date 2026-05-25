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
      <p className={cn("mb-1.5 font-medium text-cocoa-400", large ? "text-[16px]" : "text-[13px]")}>{eyebrow}</p>
      <h1 className={cn("font-medium leading-tight text-cocoa-900", large ? "text-[30px]" : "text-[24px]")}>{title}</h1>
      {description ? (
        <p className={cn("mt-2 leading-relaxed text-cocoa-500", large ? "text-[17px]" : "text-[14px]")}>{description}</p>
      ) : null}
    </header>
  );
}
