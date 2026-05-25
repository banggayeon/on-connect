import { cn } from "@/lib/utils";

type AppButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function AppButton({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  type = "button"
}: AppButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full font-medium transition-[background-color,transform,box-shadow] duration-[120ms] ease-out active:scale-[0.97] inline-flex items-center justify-center gap-2",
        "rounded-[999px]",
        size === "lg" ? "px-7 py-[22px] text-[18px]" : "px-6 py-[17px] text-[16px]",
        variant === "primary" && !disabled && "bg-[#241E1A] text-[#FBF6EC] active:bg-[#2D261F]",
        variant === "primary" && disabled && "bg-[#D5CFC8] text-[#9A8B7D] cursor-not-allowed",
        variant === "secondary" && !disabled && "bg-[#FFFBF2] text-[#241E1A] border border-[#E8DECF] active:bg-[#EDE4D6]",
        variant === "secondary" && disabled && "bg-[#D5CFC8] text-[#9A8B7D] border border-[#E8DECF] cursor-not-allowed",
        variant === "ghost" && "bg-transparent text-[#8A6B5C] active:bg-[#F0E7D7]",
        className
      )}
      style={{ letterSpacing: "-0.012em" }}
    >
      {children}
    </button>
  );
}
