"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  email?: string;
}

const CHARACTER_LIMIT = 600;
type SortOrder = "newest" | "oldest";

const mockComments: Comment[] = [
  {
    id: "1",
    author: "張三",
    content:
      "很實用的教學！我一直在找如何設定 Ollama 對外連線的方法，這篇文章解決了我的問題。",
    createdAt: new Date("2025-10-22T10:30:00"),
  },
  {
    id: "2",
    author: "李四",
    content: "請問這樣設定後，安全性方面需要注意什麼嗎？",
    createdAt: new Date("2025-10-22T14:20:00"),
  },
  {
    id: "3",
    author: "王五",
    content: "感謝分享！在 Proxmox LXC 容器中測試成功了。",
    createdAt: new Date("2025-10-23T09:15:00"),
  },
];

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [newComment, setNewComment] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }, [comments, sortOrder]);

  const charactersLeft = CHARACTER_LIMIT - newComment.length;
  const isSubmitDisabled = !authorName.trim() || !newComment.trim();

  const submitComment = () => {
    if (isSubmitDisabled) return;

    const trimmedName = authorName.trim();
    const trimmedContent = newComment.trim();
    const trimmedEmail = authorEmail.trim();

    const comment: Comment = {
      id: Date.now().toString(),
      author: trimmedName,
      content: trimmedContent,
      createdAt: new Date(),
      email: trimmedEmail ? trimmedEmail : undefined,
    };

    setComments((prev) => [comment, ...prev]);
    setAuthorName("");
    setAuthorEmail("");
    setNewComment("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitComment();
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    if (value.length <= CHARACTER_LIMIT) {
      setNewComment(value);
    }
  };

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitComment();
    }
  };

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
            分享你的問題、經驗或回饋。這個前端示範僅在瀏覽器中暫存留言。
          </p>
          <div className="mt-4 h-px w-20 border-b border-newspaper-ink dark:border-zinc-100" />
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
          {sortedComments.length} 則留言
        </span>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="comment-name"
              className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
            >
              姓名
            </label>
            <input
              id="comment-name"
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="請輸入您的姓名"
              className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-newspaper-ink placeholder:text-newspaper-gray/50 focus:border-newspaper-ink focus:outline-none focus:ring-1 focus:ring-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="comment-email"
              className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
            >
              Email（選填）
            </label>
            <input
              id="comment-email"
              type="email"
              value={authorEmail}
              onChange={(event) => setAuthorEmail(event.target.value)}
              placeholder="我們不會公開顯示您的 Email"
              className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-newspaper-ink placeholder:text-newspaper-gray/50 focus:border-newspaper-ink focus:outline-none focus:ring-1 focus:ring-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="comment-content"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
          >
            留言內容
          </label>
          <textarea
            id="comment-content"
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={handleTextareaKeyDown}
            placeholder="分享您的想法..."
            rows={5}
            className="w-full resize-none border border-black/10 bg-white px-4 py-3 text-sm text-newspaper-ink placeholder:text-newspaper-gray/50 focus:border-newspaper-ink focus:outline-none focus:ring-1 focus:ring-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
          <div className="flex flex-wrap items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-500">
            <span>Ctrl / ⌘ + Enter 快速送出</span>
            <span
              className={cn(
                charactersLeft <= 40 &&
                  "text-newspaper-accent dark:text-red-400",
              )}
            >
              還可輸入 {charactersLeft} 字
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ul className="space-y-2 text-[0.75rem] text-newspaper-gray dark:text-zinc-400">
            <li>・保持禮貌與建設性。</li>
            <li>・勿張貼個人隱私資料。</li>
            <li>・留言僅示範用途，重新整理後會重置。</li>
          </ul>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitDisabled}
            className="self-end disabled:cursor-not-allowed disabled:opacity-40"
          >
            發送留言
          </Button>
        </div>
      </form>

      <div className="mt-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
              留言列表
            </span>
            <span className="text-xs uppercase tracking-[0.35em] text-newspaper-gray/70 dark:text-zinc-500">
              {sortedComments.length} 則
            </span>
          </div>
          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            <span>排序</span>
            {(["newest", "oldest"] as const).map((order) => (
              <button
                key={order}
                type="button"
                onClick={() => setSortOrder(order)}
                className={cn(
                  "border border-black/10 px-3 py-1 transition hover:border-newspaper-ink hover:text-newspaper-ink dark:border-white/10 dark:hover:border-zinc-100 dark:hover:text-zinc-100",
                  sortOrder === order
                    ? "bg-newspaper-ink text-newspaper-paper hover:bg-newspaper-ink dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-newspaper-gray dark:text-zinc-400",
                )}
              >
                {order === "newest" ? "最新" : "最舊"}
              </button>
            ))}
          </div>
        </div>

        {sortedComments.length === 0 ? (
          <div className="border border-black/10 bg-white px-6 py-12 text-center text-sm text-newspaper-gray dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400">
            目前還沒有留言，成為第一個留言的人吧！
          </div>
        ) : (
          <ol className="space-y-6">
            {sortedComments.map((comment) => {
              const initials = comment.author
                .replace(/\s+/g, "")
                .slice(0, 2)
                .toUpperCase();
              const timestamp = formatDate(comment.createdAt, "yyyy-MM-dd HH:mm");

              return (
                <li
                  key={comment.id}
                  className="border border-black/10 bg-white px-6 py-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
                >
                  <article className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 bg-newspaper-gray/10 text-sm font-semibold uppercase tracking-[0.25em] text-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50">
                      {initials}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                        <span className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                          {comment.author}
                        </span>
                        <time
                          dateTime={comment.createdAt.toISOString()}
                          className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400"
                        >
                          {timestamp}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed text-newspaper-gray dark:text-zinc-300">
                        {comment.content}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
