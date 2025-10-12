import type { Author, Post, Tag } from "@prisma/client";
import type { ProjectContent } from "@/lib/mdx";

export type BlogPost = Post & {
  tags: Tag[];
  author: Author;
};

// Optimized type for list views - excludes heavy content field
export type BlogPostListItem = Omit<Post, "content" | "authorId"> & {
  tags: Tag[];
  readingTime?: string;
};

export type ProjectItem = ProjectContent;
