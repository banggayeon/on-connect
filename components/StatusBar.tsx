export function StatusBar() {
  return (
    <div className="mb-5 flex items-center justify-between text-[12px] font-semibold text-cocoa-900">
      <span>9:41</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="tracking-[-2px]">●●●</span>
        <span className="h-2.5 w-4 rounded-[3px] border border-cocoa-900/45">
          <span className="block h-full w-2.5 rounded-[2px] bg-cocoa-900/70" />
        </span>
      </div>
    </div>
  );
}
