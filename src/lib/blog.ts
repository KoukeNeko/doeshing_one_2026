import type { Prisma } from "@prisma/client";
import type { BlogPostListItem } from "@/types/content";
import { unstable_cache } from "next/cache";
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

// Optimized select for list views - excludes heavy content field
const listPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  featured: true,
  featuredOrder: true,
  tags: true,
} satisfies Prisma.PostSelect;

// Full select for detail views
const detailPostSelect = {
  ...listPostSelect,
  content: true,
  authorId: true,
  author: true,
} satisfies Prisma.PostSelect;

type ListPost = Prisma.PostGetPayload<{ select: typeof listPostSelect }>;
type DetailPost = Prisma.PostGetPayload<{ select: typeof detailPostSelect }>;

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
  // Build cache key including all parameters
  const cacheKey = `posts-${sort}-${page}-${perPage}-${tag || "all"}-${search || "none"}`;
  
  // Cache tags for targeted revalidation
  const cacheTags = ["posts"];
  if (tag) cacheTags.push(`tag-${tag}`);

  const fetchPosts = async () => {
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
      select: listPostSelect,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      posts: posts.map((post: ListPost) => ({
        ...post,
        readingTime: undefined, // Will be calculated on client if needed
      })),
      total,
    };
  };

  // Cache all queries, with longer revalidation for search results
  return unstable_cache(fetchPosts, [cacheKey], {
    revalidate: search ? 300 : 60, // Search: 5 min, Others: 1 min
    tags: cacheTags,
  })();
}

export const getFeaturedPosts = unstable_cache(
  async (limit = 3) => {
    // First, try to get manually featured posts
    const featuredPosts = await prisma.post.findMany({
      where: {
        published: true,
        featured: true,
      },
      orderBy: {
        featuredOrder: "asc",
      },
      take: limit,
      select: listPostSelect,
    });

    // If we don't have enough featured posts, fill with latest posts
    if (featuredPosts.length < limit) {
      const additionalPosts = await prisma.post.findMany({
        where: {
          published: true,
          featured: false,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: limit - featuredPosts.length,
        select: listPostSelect,
      });

      return [...featuredPosts, ...additionalPosts].map((post: ListPost) => ({
        ...post,
        readingTime: undefined,
      }));
    }

    return featuredPosts.map((post: ListPost) => ({
      ...post,
      readingTime: undefined,
    }));
  },
  ["featured-posts"],
  {
    revalidate: 60,
    tags: ["posts", "featured"],
  },
);

export async function getPostBySlug(slug: string, includeDraft = false) {
  const fetchPost = async () => {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: detailPostSelect,
    });

    if (!post) return null;
    if (!includeDraft && !post.published) return null;

    return {
      ...post,
      readingTime: getReadingTime(post.content),
    };
  };

  // Only cache published posts
  if (!includeDraft) {
    return unstable_cache(fetchPost, [`post-${slug}`], {
      revalidate: 60,
      tags: ["posts", `post-${slug}`],
    })();
  }

  return fetchPost();
}

export async function getAdjacentPosts(publishedAt: Date, _postId: string) {
  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { lt: publishedAt },
      },
      orderBy: { publishedAt: "desc" },
      select: listPostSelect,
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { gt: publishedAt },
      },
      orderBy: { publishedAt: "asc" },
      select: listPostSelect,
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
    select: listPostSelect,
    orderBy: { publishedAt: "desc" },
  });

  return posts.map((post: ListPost) => ({
    ...post,
    readingTime: undefined,
  }));
}

type TagWithPostCount = Prisma.TagGetPayload<{
  include: { _count: { select: { posts: true } } };
}>;

export const getTagsWithCount = unstable_cache(
  async () => {
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
  },
  ["tags-with-count"],
  {
    revalidate: 120,
    tags: ["tags"],
  },
);
