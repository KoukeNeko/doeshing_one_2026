# Migration Guide: Database to Static MDX Blog

This document explains the migration from a database-driven blog (using Supabase/Prisma) to a static MDX-based blog system.

## What Changed

### Before (Database-driven)
- Blog posts stored in Supabase/PostgreSQL database
- Required database connection for all operations
- Admin UI to create/edit posts
- Runtime database queries

### After (Static MDX)
- Blog posts stored as `.mdx` files in `content/blog/`
- No database required for blog functionality
- Edit posts directly in your code editor
- Build-time file system reads

## Benefits of Static MDX

1. **No Database Required**: Simpler deployment, no connection strings or migrations
2. **Version Control**: All content tracked in git with full history
3. **Better Developer Experience**: Write in your editor with full IDE support
4. **Faster Builds**: No runtime database queries
5. **Easier Backup**: Content is just files in your repository
6. **Collaboration**: Use pull requests for content contributions

## Migration Steps

### 1. Export Existing Posts (If you had database posts)

If you previously had posts in a database, you'll need to export them to MDX files. Here's a sample script:

```typescript
// scripts/export-posts-to-mdx.ts
import { prisma } from '../src/lib/db';
import fs from 'fs';
import path from 'path';

async function exportPosts() {
  const posts = await prisma.post.findMany({
    include: {
      tags: true,
      author: true,
    },
  });

  for (const post of posts) {
    const frontmatter = `---
title: "${post.title}"
excerpt: "${post.excerpt || ''}"
coverImage: "${post.coverImage || ''}"
date: "${post.publishedAt?.toISOString().split('T')[0] || post.createdAt.toISOString().split('T')[0]}"
author:
  name: "${post.author.name}"
  avatar: "${post.author.avatar || ''}"
  bio: "${post.author.bio || ''}"
tags: [${post.tags.map(t => `"${t.name}"`).join(', ')}]
published: ${post.published}
featured: ${post.featured}
${post.featuredOrder ? `featuredOrder: ${post.featuredOrder}` : ''}
---

${post.content}
`;

    const filePath = path.join(process.cwd(), 'content', 'blog', `${post.slug}.mdx`);
    fs.writeFileSync(filePath, frontmatter);
    console.log(`Exported: ${post.slug}`);
  }
}

exportPosts();
```

### 2. Update Your Workflow

**Old Workflow:**
1. Log into admin panel
2. Create/edit post in web interface
3. Save to database
4. Post appears on site

**New Workflow:**
1. Create/edit `.mdx` file in `content/blog/`
2. Commit and push to git
3. Site rebuilds automatically (on Vercel/Netlify)
4. Post appears on site

### 3. Directory Structure

Organize your blog posts with optional subcategories:

```
content/blog/
├── README.md                          # Documentation
├── first-post.mdx                     # Top-level post
├── second-post.mdx                    # Another post
└── tutorials/                         # Subcategory
    ├── tutorial-1.mdx
    └── tutorial-2.mdx
```

### 4. Frontmatter Format

Each MDX file needs frontmatter at the top:

```mdx
---
title: "Your Post Title"
excerpt: "Brief description"
coverImage: "/images/blog/cover.jpg"
date: "2025-10-23"
author:
  name: "Author Name"
  avatar: "/images/avatar.jpg"
  bio: "Author bio"
tags: ["Tag1", "Tag2"]
published: true
featured: false
---

Your content here...
```

## What Still Works

- ✅ All blog pages and routes
- ✅ Search functionality
- ✅ Tag filtering
- ✅ Pagination
- ✅ Related posts
- ✅ Table of contents
- ✅ Reading time calculation
- ✅ View tracking
- ✅ Featured posts
- ✅ Same UI/UX

## What Changed

- ❌ Admin UI for creating posts (create `.mdx` files instead)
- ❌ Database queries (file system reads instead)
- ❌ Runtime post creation (build-time only)
- ✅ View counts now use in-memory storage (resets on redeploy - can be enhanced later)

## Optional: Keep Database for Other Features

The Prisma schema and database setup are still available if you want to use them for:
- User authentication
- Comments system
- Newsletter subscriptions
- Other dynamic features

Just don't use them for blog posts anymore.

## Troubleshooting

### Posts not showing up?
- Check that `published: true` in frontmatter
- Verify file is in `content/blog/` directory
- Check date format is `YYYY-MM-DD`
- Restart dev server (`npm run dev`)

### Build errors?
- Validate frontmatter YAML syntax
- Check all required fields are present
- Ensure dates are valid

### Old admin routes?
- Admin endpoints now return 501 (Not Implemented)
- Create/edit posts by editing `.mdx` files

## Questions?

See `content/blog/README.md` for detailed documentation on creating posts.
