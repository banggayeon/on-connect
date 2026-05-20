import { Gift, Sparkles } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { BottomTabBar } from "@/components/BottomTabBar";
import { MobileFrame } from "@/components/MobileFrame";
import { ScreenHeader } from "@/components/ScreenHeader";
import { giftRecommendations } from "@/lib/mockData";

export default function GiftPage() {
  return (
    <MobileFrame screenClassName="bg-gradient-to-b from-[#FFEDE0] to-cream-50">
      <ScreenHeader eyebrow={giftRecommendations.screen.eyebrow} title={giftRecommendations.screen.title} description={giftRecommendations.screen.description} />
      <div className="space-y-4">
        <section className="rounded-[22px] bg-gradient-to-br from-coral-400 to-coral-500 p-5 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{giftRecommendations.occasion.dDay}</p>
              <h2 className="mt-1 text-2xl font-semibold">{giftRecommendations.occasion.label}</h2>
            </div>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">{giftRecommendations.occasion.dateText}</span>
          </div>
        </section>
        <AppCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-cocoa-400">{giftRecommendations.sectionTitle}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-500">
              <Sparkles size={15} /> AI
            </span>
          </div>
          <div className="space-y-3">
            {giftRecommendations.items.map((gift) => (
              <div key={gift.id} className="flex gap-3 rounded-2xl bg-cream-100 p-3">
                <span className={`h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br ${gift.gradientClass}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{gift.name}</p>
                  <p className="mt-1 text-sm text-cocoa-500">{gift.meta}</p>
                  <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-cocoa-400">{gift.badge}</p>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
        <section className="rounded-2xl bg-leaf-100 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-leaf-800">
            <Gift size={18} /> {giftRecommendations.recommendationReasonTitle}
          </p>
          <p className="text-sm leading-relaxed text-leaf-900">{giftRecommendations.recommendationReason}</p>
        </section>
        <AppButton>{giftRecommendations.ctaLabel}</AppButton>
      </div>
      <BottomTabBar />
    </MobileFrame>
  );
}
