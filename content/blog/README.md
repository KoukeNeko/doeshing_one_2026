# Blog Content

This directory contains all blog posts in MDX format. Posts are automatically loaded and displayed on the website.

## File Structure

```
content/blog/
├── post-slug.mdx          # Individual post
├── another-post.mdx       # Another post
└── category-name/         # Subcategory (optional)
    └── post-in-category.mdx
```

## Creating a New Post

1. Create a new `.mdx` file in this directory
2. Add frontmatter at the top of the file
3. Write your content in Markdown/MDX below the frontmatter

### Example Post

```mdx
---
title: "Your Post Title"
excerpt: "A brief description of your post that appears in listings"
coverImage: "/images/blog/cover.svg"
date: "2025-10-23"
author:
  name: "Your Name"
  avatar: "/images/avatar.svg"
  bio: "Your bio here"
tags: ["Tag1", "Tag2", "Tag3"]
published: true
featured: false
featuredOrder: 1
category: "optional-category"
---

## Your Content Here

Write your blog post content using Markdown...
```

## Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `excerpt` | string | Yes | Brief description for listings and SEO |
| `coverImage` | string | No | Path to cover image |
| `date` | string | Yes | Publication date in YYYY-MM-DD format |
| `author.name` | string | Yes | Author's name |
| `author.avatar` | string | No | Path to author avatar image |
| `author.bio` | string | No | Author biography |
| `tags` | array | Yes | List of tags (will be converted to slugs) |
| `published` | boolean | Yes | Whether the post is published |
| `featured` | boolean | No | Whether to feature on homepage |
| `featuredOrder` | number | No | Order for featured posts (lower = higher priority) |
| `category` | string | No | Category name (auto-detected from folder structure) |
| `slug` | string | No | Custom slug (defaults to filename) |

## Categories/Subcategories

You can organize posts into subcategories by creating folders:

```
content/blog/
├── general-post.mdx
├── tutorials/
│   ├── tutorial-1.mdx
│   └── tutorial-2.mdx
└── guides/
    └── guide-1.mdx
```

Posts in subfolders will automatically have their category set to the folder name.

## Tags

Tags are automatically normalized to slugs. For example:
- "Next.js" → "nextjs"
- "TypeScript" → "typescript"
- "Design Systems" → "design-systems"

## Publishing

- Set `published: true` to make a post visible
- Set `published: false` to hide a post (draft mode)
- Posts are sorted by date (newest first)

## Featured Posts

- Set `featured: true` to show a post on the homepage
- Use `featuredOrder` to control the order (lower numbers appear first)
- If there aren't enough featured posts, the latest posts will be shown

## MDX Features

You can use all standard Markdown features plus:
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Lists
- Headings (automatically get table of contents)

Example:

```mdx
## Code Example

```typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a quote

- List item 1
- List item 2
```
