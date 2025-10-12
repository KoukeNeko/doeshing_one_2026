import type { Prisma } from "@prisma/client";
import type { BlogPostListItem } from "@/types/content";
import { prisma } from "./db";
import { getReadingTime } from "./utils";

export interface BlogFilters {
  search?: string;
  tag?: string;
  sort?: "latest" | "views";
  page?: number;
  perPage?: number;
  published?: boolean;
}

const basePostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  coverImage: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  tags: true,
  author: true,
} satisfies Prisma.PostSelect;

type SelectedPost = Prisma.PostGetPayload<{ select: typeof basePostSelect }>;

export async function getPublishedPosts({
  search,
  tag,
  sort = "latest",
  page = 1,
  perPage = 9,
}: BlogFilters = {}): Promise<{
  posts: BlogPostListItem[];
  total: number;
}> {
  const where: Prisma.PostWhereInput = {
    published: true,
  };

  if (tag) {
    where.tags = {
      some: {
        slug: tag,
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const total = await prisma.post.count({ where });

  const orderBy =
    sort === "views"
      ? { views: "desc" as const }
      : { publishedAt: "desc" as const };

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    select: basePostSelect,
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    posts: posts.map((post: SelectedPost) => ({
      ...post,
      readingTime: getReadingTime(post.content),
    })),
    total,
  };
}

export async function getFeaturedPosts(limit = 3) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
    select: basePostSelect,
  });

  return posts.map((post: SelectedPost) => ({
    ...post,
    readingTime: getReadingTime(post.content),
  }));
}

export async function getPostBySlug(slug: string, includeDraft = false) {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: basePostSelect,
  });

  if (!post) return null;
  if (!includeDraft && !post.published) return null;

  return {
    ...post,
    readingTime: getReadingTime(post.content),
  };
}

export async function getAdjacentPosts(publishedAt: Date, _postId: string) {
  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { lt: publishedAt },
      },
      orderBy: { publishedAt: "desc" },
      select: basePostSelect,
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { gt: publishedAt },
      },
      orderBy: { publishedAt: "asc" },
      select: basePostSelect,
    }),
  ]);

  return { previous, next };
}

export async function incrementPostViews(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

export async function getRelatedPosts(
  postId: string,
  tagSlugs: string[],
  limit = 3,
) {
  if (!tagSlugs.length) return [];

  const posts = await prisma.post.findMany({
    where: {
      id: { not: postId },
      published: true,
      tags: {
        some: {
          slug: { in: tagSlugs },
        },
      },
    },
    take: limit,
    select: basePostSelect,
    orderBy: { publishedAt: "desc" },
  });

  return posts.map((post: SelectedPost) => ({
    ...post,
    readingTime: getReadingTime(post.content),
  }));
}

type TagWithPostCount = Prisma.TagGetPayload<{
  include: { _count: { select: { posts: true } } };
}>;

export async function getTagsWithCount() {
  const tags: TagWithPostCount[] = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return tags.map((tagItem) => ({
    slug: tagItem.slug,
    name: tagItem.name,
    count: tagItem._count.posts,
  }));
}
