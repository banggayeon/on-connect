import { cn } from "@/lib/utils";

export function RoleSelectCard({
  label,
  description,
  badge,
  selected,
  tone
}: {
  label: string;
  description: string;
  badge: string;
  selected?: boolean;
  tone: "parent" | "child";
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border p-5 shadow-card",
        selected ? "border-transparent bg-gradient-to-br from-honey-100 to-coral-300/40" : "border-cream-300 bg-white"
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white",
            tone === "parent" ? "bg-gradient-to-br from-coral-300 to-coral-400" : "bg-gradient-to-br from-leaf-300 to-leaf-500"
          )}
        >
          {badge}
        </span>
        <p className="text-lg font-semibold text-cocoa-900">{label}</p>
      </div>
      <p className="text-sm leading-relaxed text-cocoa-500">{description}</p>
    </div>
  );
}
