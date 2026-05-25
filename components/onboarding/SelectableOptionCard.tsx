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
    base: "border-[#E8DECF] bg-[#FFFBF2] text-[#3D332C] hover:border-[#6E4A39] hover:bg-[#FAF0E4] focus-visible:ring-[#6E4A39]",
    selected: "border-[#6E4A39] border-2 bg-[#F1E5C8] text-[#241E1A]",
    radio: "border-[#D5C9BB]",
    radioSelected: "border-[#6E4A39] bg-[#F1E5C8]"
  },
  green: {
    base: "border-[#E8DECF] bg-[#FFFBF2] text-[#241E1A] hover:border-[#6E4A39] hover:bg-[#FAF0E4] focus-visible:ring-[#6E4A39]",
    selected: "border-[#6E4A39] border-2 bg-[#F1E5C8] text-[#241E1A]",
    radio: "border-[#D5C9BB]",
    radioSelected: "border-[#6E4A39] bg-[#F1E5C8]"
  },
  soft: {
    base: "border-[#E8DECF] bg-[#FFFBF2] text-[#3D332C] hover:border-[#6E4A39] hover:bg-[#FAF0E4] focus-visible:ring-[#6E4A39]",
    selected: "border-[#6E4A39] border-2 bg-[#F1E5C8] text-[#241E1A]",
    radio: "border-[#D5C9BB]",
    radioSelected: "border-[#6E4A39] bg-[#F1E5C8]"
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
        "w-full border text-left transition-[background-color,border-color,transform] duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EE]",
        size === "sm" && "min-h-[44px] rounded-[999px] px-2.5 py-2 text-[14px]",
        size === "md" && "min-h-[62px] rounded-[999px] px-4 py-3 text-[16px]",
        size === "lg" && "min-h-[72px] rounded-[999px] px-4 py-4 text-[21px]",
        selected ? classes.selected : classes.base,
        disabled && "cursor-not-allowed border-[#E8DECF] bg-[#D5CFC8] text-[#9A8B7D] hover:border-[#E8DECF] hover:bg-[#D5CFC8] hover:text-[#9A8B7D]"
      )}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          {leading ? <span className="shrink-0">{leading}</span> : null}
          <span className="min-w-0">
            <span className="block font-medium leading-snug">{label}</span>
            {description ? (
              <span className={cn("mt-1 block text-[13px] leading-snug", selected ? "text-[#6E4A39]" : "text-[#8A6B5C]")}>
                {description}
              </span>
            ) : null}
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
            {indicator === "radio" && selected ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#6E4A39]" />
            ) : null}
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

export function OnboardingNextButton({ children = "다음", disabled, onClick }: NextButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "mt-4 w-full rounded-[999px] px-5 py-3.5 text-[16px] font-semibold transition-[background-color,transform] duration-[120ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E4A39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EE]",
        disabled
          ? "cursor-not-allowed bg-[#D5CFC8] text-[#9A8B7D]"
          : "bg-[#241E1A] text-[#FBF6EC] hover:opacity-90 active:bg-[#2D261F]"
      )}
    >
      {children}
    </button>
  );
}
