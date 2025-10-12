"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") || "/admin";
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-newspaper-ink dark:text-zinc-50">
            Doeshing Gazette
          </h1>
          <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
            Admin Dashboard
          </p>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="mb-6 text-xl font-semibold text-newspaper-ink dark:text-zinc-50">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-newspaper-ink focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-red-400 dark:focus:ring-red-400"
                placeholder="admin@doeshing.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-newspaper-ink focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-red-400 dark:focus:ring-red-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-newspaper-accent px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-newspaper-gray dark:text-zinc-400">
            Default credentials: admin@doeshing.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
