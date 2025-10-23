"use client";

import Giscus from "@giscus/react";

export default function CommentSection() {
  return (
    <section
      aria-labelledby="comment-heading"
      className="border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900"
      data-testid="comment-section"
    >
      <header className="space-y-6 border-b border-black/10 pb-6 dark:border-white/10">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
            讀者交流
          </span>
          <h2
            id="comment-heading"
            className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-4xl"
          >
            加入討論
          </h2>
          <p className="max-w-2xl text-sm text-newspaper-gray dark:text-zinc-400">
            使用 GitHub 帳號登入以參與討論。所有留言將儲存在 GitHub Discussions 中。
          </p>
          <div className="mt-4 h-px w-20 border-b border-newspaper-ink dark:border-zinc-100" />
        </div>
      </header>

      <div className="mt-8">
        <Giscus
          id="comments"
          repo="KoukeNeko/doeshing_one_2026"
          repoId="R_kgDOQA8TqA"
          category="General"
          categoryId="DIC_kwDOQA8TqM4Cw-UU"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="zh-TW"
        />
      </div>
    </section>
  );
}
