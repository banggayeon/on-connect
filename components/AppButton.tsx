import { cn } from "@/lib/utils";

type AppButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

export function AppButton({
  children,
  className,
  variant = "primary",
  size = "md"
}: AppButtonProps) {
  return (
    <button
      className={cn(
        "w-full rounded-2xl font-semibold transition active:scale-[0.99]",
        size === "lg" ? "px-5 py-4 text-[17px]" : "px-4 py-3 text-[15px]",
        variant === "primary" && "bg-gradient-to-br from-coral-400 to-coral-500 text-white shadow-[0_10px_20px_rgba(224,120,86,0.24)]",
        variant === "secondary" && "bg-white text-cocoa-900 shadow-card",
        variant === "ghost" && "bg-transparent text-cocoa-400",
        className
      )}
    >
      {children}
    </button>
  );
}
