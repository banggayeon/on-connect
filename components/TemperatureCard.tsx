import { relationshipTemperature } from "@/lib/mockData";

export function TemperatureCard() {
  return (
    <section className="rounded-[22px] bg-gradient-to-br from-coral-400 to-coral-300 p-5 text-white shadow-[0_14px_28px_rgba(255,138,101,0.28)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm opacity-90">{relationshipTemperature.label}</span>
        <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold">{relationshipTemperature.deltaText}</span>
      </div>
      <div className="flex items-end gap-2">
        <strong className="text-[42px] font-semibold leading-none">{relationshipTemperature.valueText}</strong>
        <span className="pb-1 text-sm opacity-90">{relationshipTemperature.stateText}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/30">
        <div className="h-full rounded-full bg-white" style={{ width: `${relationshipTemperature.progressPercent}%` }} />
      </div>
      <p className="mt-3 text-sm leading-relaxed opacity-90">{relationshipTemperature.note}</p>
    </section>
  );
}
