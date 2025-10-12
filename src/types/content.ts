import type { Author, Post, Tag } from "@prisma/client";
import type { ProjectContent } from "@/lib/mdx";

export type BlogPost = Post & {
  tags: Tag[];
  author: Author;
};

export type BlogPostListItem = BlogPost & {
  readingTime?: string;
};

export type ProjectItem = ProjectContent;
