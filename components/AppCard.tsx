import { cn } from "@/lib/utils";

type AppCardProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "lime" | "mint" | "peach" | "lilac" | "blush" | "cream";
};

const toneStyles: Record<NonNullable<AppCardProps["tone"]>, string> = {
  surface: "bg-[#FFFBF2] border border-[#E8DECF]",
  lime:    "bg-[#D8E0A6]",
  mint:    "bg-[#CDDCC8]",
  peach:   "bg-[#F6D6BD]",
  lilac:   "bg-[#D9D0E5]",
  blush:   "bg-[#F1D6CC]",
  cream:   "bg-[#F1E5C8]"
};

export function AppCard({
  children,
  className,
  tone = "surface"
}: AppCardProps) {
  return (
    <section className={cn("rounded-[26px] p-6", toneStyles[tone], className)}>
      {children}
    </section>
  );
}
