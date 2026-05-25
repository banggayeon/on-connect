import { AppButton } from "@/components/AppButton";
import { MobileFrame } from "@/components/MobileFrame";
import { ScreenHeader } from "@/components/ScreenHeader";
import { cn } from "@/lib/utils";

export function OnboardingStepLayout({
  eyebrow,
  title,
  description,
  children,
  cta = "다음",
  senior = false
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  cta?: string;
  senior?: boolean;
  background?: string;
}) {
  return (
    <MobileFrame screenClassName={cn("flex flex-col")}>
      <ScreenHeader eyebrow={eyebrow} title={title} description={description} large={senior} />
      <div className="flex-1">{children}</div>
      <AppButton size={senior ? "lg" : "md"}>{cta}</AppButton>
    </MobileFrame>
  );
}
