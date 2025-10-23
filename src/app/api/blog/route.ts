import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";

// Note: POST endpoint is disabled for static MDX blog.
// To add new blog posts, create MDX files in content/blog/

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const tag = url.searchParams.get("tag") ?? undefined;
  const search = url.searchParams.get("search") ?? undefined;
  const sortParam = url.searchParams.get("sort");
  const perPage = Number(url.searchParams.get("perPage") ?? POSTS_PER_PAGE);

  const sort = sortParam === "views" ? "views" : "latest";

  const { posts, total } = await getPublishedPosts({
    page: Number.isNaN(page) ? 1 : page,
    search,
    tag,
    sort,
    perPage,
  });

  return NextResponse.json({
    data: posts,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

export async function POST() {
  return NextResponse.json(
    { 
      message: "Blog posts are now managed as static MDX files. Please add new posts to content/blog/ directory.",
      hint: "Create a .mdx file with frontmatter in content/blog/ to add a new post."
    },
    { status: 501 } // Not Implemented
  );
}
