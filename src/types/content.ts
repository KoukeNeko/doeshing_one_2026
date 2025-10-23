import type { ProjectContent } from "@/lib/mdx";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  featured: boolean;
  featuredOrder?: number;
  tags: Tag[];
  author: Author;
  readingTime?: string;
}

// Optimized type for list views - excludes heavy content field
export type BlogPostListItem = Omit<BlogPost, "content" | "author"> & {
  readingTime?: string;
};

export type ProjectItem = ProjectContent;
