"use client";

export function WipRibbon() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] h-screen w-screen overflow-hidden">
      <div
        className="absolute right-[-100px] top-[0px] w-[320px] rotate-[45deg] transform bg-[#dc2626] text-center shadow-md dark:bg-red-700"
        style={{
          boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="border-y border-black/15 py-2 dark:border-white/15">
          <span className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.35em] text-white opacity-95">
            Work in Progress
          </span>
        </div>
      </div>
    </div>
  );
}
