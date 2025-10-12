export default function BlogLoading() {
  const skeletonCards = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="space-y-10">
      {/* Header skeleton */}
      <header className="space-y-6">
        {/* SectionHeading skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse bg-newspaper-accent/20 dark:bg-red-400/20" />
          <div className="h-10 w-3/4 animate-pulse bg-black/5 dark:bg-white/5" />
          <div className="h-6 w-full max-w-2xl animate-pulse bg-black/5 dark:bg-white/5" />
        </div>

        {/* Search and filter bar skeleton */}
        <div className="border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 border border-black/10 px-4 py-2 dark:border-white/10">
                <div className="h-3 w-16 animate-pulse bg-black/10 dark:bg-white/10" />
                <div className="h-3 flex-1 animate-pulse bg-black/5 dark:bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-12 animate-pulse bg-black/10 dark:bg-white/10" />
                <div className="h-9 w-32 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
              </div>
              <div className="h-9 w-24 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
            </div>
            <div className="h-4 w-24 animate-pulse bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      </header>

      {/* Tag filter skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-20 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Blog grid skeleton */}
      <div className="flex flex-col gap-12">
        {/* Featured section */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.slice(0, 3).map((i) => (
            <div
              key={i}
              className="group border border-black/10 bg-white shadow-sm shadow-black/5 dark:border-white/10 dark:bg-zinc-900"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image skeleton */}
              <div className="aspect-[16/10] w-full animate-pulse border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />

              {/* Content skeleton */}
              <div className="space-y-5 px-6 py-6 sm:px-8">
                {/* Tags skeleton */}
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
                  <div className="h-6 w-20 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
                </div>

                {/* Title skeleton */}
                <div className="space-y-2">
                  <div className="h-7 w-full animate-pulse bg-black/10 dark:bg-white/10" />
                  <div className="h-7 w-4/5 animate-pulse bg-black/10 dark:bg-white/10" />
                </div>

                {/* Excerpt skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-full animate-pulse bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-3/4 animate-pulse bg-black/5 dark:bg-white/5" />
                </div>

                {/* Meta skeleton */}
                <div className="flex items-center justify-between pt-6">
                  <div className="h-3 w-24 animate-pulse bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-16 animate-pulse bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Remaining posts section */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.slice(3, 9).map((i) => (
            <div
              key={i}
              className="border border-black/10 bg-white shadow-sm shadow-black/5 dark:border-white/10 dark:bg-zinc-900"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[16/10] w-full animate-pulse border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />

              <div className="space-y-5 px-6 py-6 sm:px-8">
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
                </div>

                <div className="space-y-2">
                  <div className="h-7 w-full animate-pulse bg-black/10 dark:bg-white/10" />
                  <div className="h-7 w-4/5 animate-pulse bg-black/10 dark:bg-white/10" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-full animate-pulse bg-black/5 dark:bg-white/5" />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="h-3 w-24 animate-pulse bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-16 animate-pulse bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-10 w-10 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
        <div className="h-10 w-10 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
        <div className="h-10 w-10 animate-pulse border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
      </div>
    </div>
  );
}
