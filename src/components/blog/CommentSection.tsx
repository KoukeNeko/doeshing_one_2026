"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  avatar?: string;
}

// Mock data for demonstration
const mockComments: Comment[] = [
  {
    id: "1",
    author: "張三",
    content: "很實用的教學！我一直在找如何設定 Ollama 對外連線的方法，這篇文章解決了我的問題。",
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
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      content: newComment,
      createdAt: new Date(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setAuthorName("");
  };

  return (
    <section className="space-y-6" data-testid="comment-section">
      {/* Header */}
      <div className="border-b-2 border-newspaper-ink pb-3 dark:border-zinc-100">
        <h2 className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50">
          留言討論
        </h2>
        <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
          {comments.length} 則留言
        </p>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="border border-black/10 bg-white px-6 py-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="author-name"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
            >
              姓名
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="請輸入您的姓名"
              className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-newspaper-ink placeholder:text-newspaper-gray/50 focus:border-newspaper-ink focus:outline-none focus:ring-1 focus:ring-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="comment-content"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
            >
              留言內容
            </label>
            <textarea
              id="comment-content"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享您的想法..."
              rows={4}
              className="w-full resize-none border border-black/10 bg-white px-4 py-3 text-sm text-newspaper-ink placeholder:text-newspaper-gray/50 focus:border-newspaper-ink focus:outline-none focus:ring-1 focus:ring-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              發送留言
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="border border-black/10 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-zinc-900">
            <p className="text-newspaper-gray dark:text-zinc-400">
              目前還沒有留言，成為第一個留言的人吧！
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="border border-black/10 bg-white px-6 py-5 shadow-sm transition hover:shadow-editorial dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-black/10 bg-newspaper-gray/10 text-sm font-semibold text-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50">
                  {comment.author.charAt(0).toUpperCase()}
                </div>

                {/* Comment Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-base font-medium text-newspaper-ink dark:text-zinc-50">
                      {comment.author}
                    </span>
                    <time className="text-xs text-newspaper-gray dark:text-zinc-400">
                      {formatDate(comment.createdAt, "yyyy-MM-dd HH:mm")}
                    </time>
                  </div>
                  <p className="text-sm leading-relaxed text-newspaper-gray dark:text-zinc-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
