export default function BlogLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Text-based loading animation */}
        <div className="archive-loader" />

        {/* Subtitle */}
        <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
          Preparing fresh ink
        </p>
      </div>
    </div>
  );
}
