import { Send, Umbrella } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { BottomTabBar } from "@/components/BottomTabBar";
import { MobileFrame } from "@/components/MobileFrame";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SignalCard } from "@/components/SignalCard";
import { careMessages } from "@/lib/mockData";

export default function SignalPage() {
  return (
    <MobileFrame screenClassName="bg-gradient-to-b from-honey-100 to-cream-50">
      <ScreenHeader eyebrow={careMessages.screen.eyebrow} title={careMessages.screen.title} description={careMessages.screen.description} />
      <div className="space-y-4">
        <AppCard>
          <p className="mb-3 text-sm font-semibold text-cocoa-400">{careMessages.parentPromptTitle}</p>
          <div className="space-y-3">
            {careMessages.suggestions.map((message) => (
              <SignalCard key={message.id} active={message.active} title={message.text} subtitle={message.helper} tone={message.tone} />
            ))}
          </div>
        </AppCard>
        <section className="rounded-2xl bg-leaf-100 p-4">
          <p className="text-sm font-semibold text-leaf-800">{careMessages.latestReply.title}</p>
          <p className="mt-2 text-lg font-semibold text-leaf-900">
            {careMessages.latestReply.message} · {careMessages.latestReply.timeAgo}
          </p>
        </section>
        <AppCard>
          <p className="mb-3 text-sm font-semibold text-cocoa-400">{careMessages.quickReplyTitle}</p>
          <div className="grid grid-cols-2 gap-2">
            {careMessages.quickReplies.map((reply, index) => (
              <button
                key={reply}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                  index === 0 ? "bg-coral-300/35 text-coral-800" : index === 1 ? "bg-leaf-100 text-leaf-800" : index === 2 ? "bg-honey-100 text-honey-800" : "bg-sky-100 text-sky-800"
                }`}
              >
                {reply}
              </button>
            ))}
          </div>
        </AppCard>
        <AppButton>
          <span className="inline-flex items-center justify-center gap-2">
            <Send size={18} /> {careMessages.sendButtonLabel}
          </span>
        </AppButton>
        <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 text-sm text-cocoa-500">
          <Umbrella size={20} className="text-sky-500" />
          {careMessages.weatherNotice}
        </div>
      </div>
      <BottomTabBar />
    </MobileFrame>
  );
}
