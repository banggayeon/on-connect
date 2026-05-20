"use client";

import { cn } from "@/lib/utils";

export type ChoiceTheme = "warm" | "green" | "soft";

type SelectableOptionCardProps = {
  label: string;
  description?: string;
  leading?: React.ReactNode;
  selected: boolean;
  theme?: ChoiceTheme;
  size?: "sm" | "md" | "lg";
  indicator?: "none" | "radio" | "toggle";
  disabled?: boolean;
  onClick: () => void;
};

const themeClasses = {
  warm: {
    base: "border-[#E6DDD3] bg-white text-[#5F4534] hover:border-[#E07856] hover:bg-[#FFE5DA] hover:text-[#8A3E25] focus-visible:ring-[#E07856]",
    selected: "border-[#E07856] bg-[#FFE5DA] text-[#8A3E25] shadow-sm",
    radio: "border-[#E6DDD3]",
    radioSelected: "border-[#E07856] bg-[#E07856]"
  },
  green: {
    base: "border-[#E6DDD3] bg-white text-[#3D2419] hover:border-[#A8C79A] hover:bg-[#F6FBF4] focus-visible:ring-[#7AB87A]",
    selected: "border-[#7AB87A] bg-[#F6FBF4] text-[#3D2419] shadow-sm",
    radio: "border-[#E6DDD3]",
    radioSelected: "border-[#7AB87A] bg-[#7AB87A]"
  },
  soft: {
    base: "border-[#E6DDD3] bg-white text-[#5F4534] hover:border-[#B07A5C] hover:bg-[#FFF8F0] focus-visible:ring-[#B07A5C]",
    selected: "border-[#B07A5C] bg-[#FFF8F0] text-[#3D2419] shadow-sm",
    radio: "border-[#E6DDD3]",
    radioSelected: "border-[#B07A5C] bg-[#B07A5C]"
  }
};

export function SelectableOptionCard({
  label,
  description,
  leading,
  selected,
  theme = "warm",
  size = "md",
  indicator = "radio",
  disabled = false,
  onClick
}: SelectableOptionCardProps) {
  const classes = themeClasses[theme];

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]",
        size === "sm" && "min-h-[44px] rounded-[12px] px-2.5 py-2 text-[14px]",
        size === "md" && "min-h-[62px] rounded-[16px] px-4 py-3 text-[16px]",
        size === "lg" && "min-h-[72px] rounded-[20px] px-4 py-4 text-[21px]",
        selected ? classes.selected : classes.base,
        disabled && "cursor-not-allowed border-[#E6DDD3] bg-[#E5DED6] text-[#9E948A] hover:border-[#E6DDD3] hover:bg-[#E5DED6] hover:text-[#9E948A]"
      )}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          {leading ? <span className="shrink-0">{leading}</span> : null}
          <span className="min-w-0">
          <span className="block font-medium leading-snug">{label}</span>
          {description ? <span className="mt-1 block text-[13px] leading-snug text-[#8A6B5C]">{description}</span> : null}
          </span>
        </span>
        {indicator !== "none" ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full border",
              indicator === "toggle" ? "h-6 w-11 px-0.5" : "h-4 w-4",
              selected ? classes.radioSelected : classes.radio
            )}
          >
            {indicator === "radio" && selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            {indicator === "toggle" ? (
              <span className={cn("h-5 w-5 rounded-full bg-white transition", selected ? "translate-x-2.5" : "-translate-x-2.5")} />
            ) : null}
          </span>
        ) : null}
      </span>
    </button>
  );
}

type NextButtonProps = {
  children?: React.ReactNode;
  disabled: boolean;
  theme?: Extract<ChoiceTheme, "warm" | "green">;
  onClick: () => void;
};

export function OnboardingNextButton({ children = "다음", disabled, theme = "warm", onClick }: NextButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "mt-4 w-full rounded-[16px] px-5 py-3.5 text-[16px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]",
        theme === "warm" && "focus-visible:ring-[#E07856]",
        theme === "green" && "focus-visible:ring-[#7AB87A]",
        disabled
          ? "cursor-not-allowed bg-[#E5DED6] text-[#9E948A]"
          : theme === "green"
            ? "bg-[#7AB87A] text-white shadow-sm hover:bg-[#6EA86E]"
            : "bg-gradient-to-br from-[#FF8A65] to-[#E07856] text-white shadow-sm hover:brightness-[0.98]"
      )}
    >
      {children}
    </button>
  );
}
