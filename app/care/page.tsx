import { Activity, HeartPulse, Moon } from "lucide-react";
import { AppCard } from "@/components/AppCard";
import { BottomTabBar } from "@/components/BottomTabBar";
import { MobileFrame } from "@/components/MobileFrame";
import { ScreenHeader } from "@/components/ScreenHeader";
import { careReport } from "@/lib/mockData";

export default function CarePage() {
  return (
    <MobileFrame screenClassName="bg-gradient-to-b from-leaf-100 to-cream-50">
      <ScreenHeader eyebrow={careReport.screen.eyebrow} title={careReport.screen.title} description={careReport.screen.description} />
      <div className="space-y-4">
        <AppCard>
          <p className="mb-4 text-sm font-semibold text-cocoa-400">{careReport.weeklyCheckinsTitle}</p>
          <div className="grid grid-cols-7 gap-2">
            {careReport.weeklyCheckins.map((day) => (
              <div key={day.day} className="text-center">
                <span className={`mx-auto block h-8 w-8 rounded-full ${day.colorClass}`} />
                <p className="mt-2 text-xs text-cocoa-500">{day.day}</p>
              </div>
            ))}
          </div>
        </AppCard>
        <AppCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold">{careReport.healthAlert.title}</p>
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-800">{careReport.healthAlert.statusText}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-cream-100 p-4">
              <HeartPulse className="mb-2 text-coral-500" size={22} />
              <p className="text-sm text-cocoa-400">{careReport.healthAlert.metrics[0].label}</p>
              <p className="mt-1 text-xl font-semibold">{careReport.healthAlert.metrics[0].value}</p>
            </div>
            <div className="rounded-2xl bg-cream-100 p-4">
              <Activity className="mb-2 text-leaf-500" size={22} />
              <p className="text-sm text-cocoa-400">{careReport.healthAlert.metrics[1].label}</p>
              <p className="mt-1 text-xl font-semibold">{careReport.healthAlert.metrics[1].value}</p>
            </div>
          </div>
        </AppCard>
        <AppCard className="bg-gradient-to-br from-honey-100 to-coral-300/30">
          <p className="text-sm font-semibold text-cocoa-400">{careReport.warmAction.title}</p>
          <p className="mt-2 text-lg font-semibold">{careReport.warmAction.headline}</p>
          <p className="mt-1 text-sm text-cocoa-500">{careReport.warmAction.body}</p>
        </AppCard>
        <AppCard>
          <div className="flex gap-3">
            <Moon className="shrink-0 text-sky-500" size={24} />
            <div>
              <p className="font-semibold">{careReport.sleepRhythm.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-cocoa-500">{careReport.sleepRhythm.body}</p>
            </div>
          </div>
        </AppCard>
      </div>
      <BottomTabBar />
    </MobileFrame>
  );
}
