import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getPublishedPosts } from "@/lib/blog";
import { prisma } from "@/lib/db";
import { POSTS_PER_PAGE } from "@/lib/constants";

const createPostSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createPostSchema.parse(body);

    // 目前僅支援單一作者，未來可擴展為多作者系統
    // TODO: 當需要多作者時，可根據 session.user.email 查找對應作者
    const author = await prisma.author.findFirst({
      orderBy: { createdAt: "asc" }, // 使用第一個建立的作者
    });

    if (!author) {
      return NextResponse.json(
        { message: "No author found. Please run: bun prisma db seed" },
        { status: 404 }
      );
    }

    // 處理標籤
    const tagOperations = validated.tags.map(async (tagName) => {
      const slug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return prisma.tag.upsert({
        where: { slug },
        create: { name: tagName, slug },
        update: {},
      });
    });

    const tags = await Promise.all(tagOperations);

    // 建立文章
    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        content: validated.content,
        coverImage: validated.coverImage,
        published: validated.published,
        publishedAt: validated.published ? new Date() : null,
        authorId: author.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        author: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: error.errors,
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
