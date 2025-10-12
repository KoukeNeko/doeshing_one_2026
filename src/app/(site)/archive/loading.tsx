export default function BlogLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Newspaper printing press loader */}
        <div className="newspaper-loader" />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-serif text-2xl tracking-tight text-newspaper-ink dark:text-zinc-100">
            Loading Archive
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            Preparing fresh ink
          </p>
        </div>
      </div>

      <style jsx>{`
        .newspaper-loader {
          width: 60px;
          aspect-ratio: 1;
          display: grid;
          position: relative;
        }

        .newspaper-loader::before,
        .newspaper-loader::after {
          content: "";
          grid-area: 1/1;
          --dot: no-repeat
            radial-gradient(
              farthest-side,
              var(--newspaper-accent, #c41e3a) 92%,
              transparent
            );
          background: var(--dot) 50% 0, var(--dot) 50% 100%, var(--dot) 100% 50%,
            var(--dot) 0 50%;
          background-size: 14px 14px;
          animation: newspaper-spin 1.2s infinite;
        }

        .newspaper-loader::before {
          margin: 5px;
          filter: brightness(0.7);
          background-size: 10px 10px;
          animation-timing-function: linear;
        }

        @keyframes newspaper-spin {
          100% {
            transform: rotate(0.5turn);
          }
        }

        /* Dark mode adjustments */
        :global(.dark) .newspaper-loader::before,
        :global(.dark) .newspaper-loader::after {
          --dot: no-repeat
            radial-gradient(
              farthest-side,
              rgb(248 113 113) 92%,
              transparent
            );
        }
      `}</style>
    </div>
  );
}
