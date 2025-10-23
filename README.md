# Doeshing — Editorial Portfolio

Magazine-style personal site built with Next.js 15, Tailwind CSS, and static MDX content. The experience blends broadsheet-inspired layouts with modern web tooling to showcase blog posts, case studies, a résumé, and contact information.

## ✨ Highlights

- Multi-column editorial layout with serif/sans typography pairings and accent red detailing
- **100% Static** - No database required! All content is file-based
- **File-based blog system** with MDX support, search, tag filters, category support, and related articles
- Markdown-driven project case studies rendered via a unified/rehype pipeline
- Comprehensive CV page with printable styles and timeline layout
- Automatic SEO with static sitemap and robots.txt generation
- View tracking with in-memory cache (optional database support available)
- Accessible navigation, skip links, responsive design from 320px to 1440px+

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 3 with typography plugin and custom magazine tokens
- **Content:** 100% File-based - MDX blog posts + Markdown projects (no database!)
- **Content Processing:** gray-matter, unified, remark, rehype
- **Code Highlighting:** Shiki with rehype-pretty-code
- **Tooling:** TypeScript, Biome, Zod, reading-time, date-fns
- **Optional:** Prisma schema available for future database features

## 📁 Project Structure

```
src/
  app/
    (site)/           Public-facing pages
      archive/        Blog list + detail pages
      work/           Project list + detail pages
      about/          CV/résumé page
      contact/        Contact info + clipboard helper
    admin/            Admin panel (optional, requires database setup)
    api/              REST endpoints (optional)
    sitemap.ts        Auto-generated sitemap (static)
    robots.ts         Auto-generated robots.txt (static)
  components/         Layout, blog, project, and UI primitives
  lib/
    blog.ts           File-based blog post loader and utilities
    mdx.ts            MDX/Markdown rendering pipeline
    utils.ts          Helper functions (slugify, date formatting, etc.)
  styles/             Tailwind global layers
  types/              Shared type definitions
content/
  blog/               MDX blog posts (supports nested categories)
    tutorials/        Example category
      advanced/       Example subcategory
  work/               Markdown project case studies
prisma/               Optional: Prisma schema for future features
public/images/        Editorial placeholder artwork + icons
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables (Optional)

The site works out of the box without any configuration! For production deployment, create a `.env` file:

```bash
# Site Configuration (Optional, recommended for production)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

**Environment Variables:**

- `NEXT_PUBLIC_SITE_URL` — Public site URL for metadata, SEO, and social sharing (default: <http://localhost:3000>)

**Optional - For Database Features:**

If you want to enable the admin panel or database features in the future:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run the development server

```bash
npm run dev
```

Visit <http://localhost:3000> to explore the editorial layout.

**Development Commands:**

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Check code formatting with Biome
npm run format  # Format code with Biome
```

## 📝 Content Authoring

### Blog Posts (File-based)

Blog posts are managed as MDX files in `content/blog/`:

1. Create a new `.mdx` file in `content/blog/` (or a subdirectory for categories)
2. Add frontmatter at the top:

```mdx
---
title: "Your Post Title"
excerpt: "A brief description that appears in listings and SEO"
coverImage: "/images/blog/cover.svg"
date: "2025-10-23"
author:
  name: "Your Name"
  avatar: "/images/avatar.svg"
  bio: "Your bio here"
tags: ["Next.js", "TypeScript", "Web Development"]
published: true
featured: false
featuredOrder: 1
---

## Your Content Here

Write your blog post content using Markdown and MDX...
```

**Frontmatter Fields:**

- `title` (required) — Post title
- `excerpt` (required) — Brief description for listings and SEO
- `date` (required) — Publication date in YYYY-MM-DD format
- `author.name` (required) — Author's name
- `tags` (required) — Array of tags
- `published` (required) — Whether the post is published (true/false)
- `coverImage` (optional) — Path to cover image
- `author.avatar` (optional) — Path to author avatar
- `author.bio` (optional) — Author biography
- `featured` (optional) — Show on homepage (true/false)
- `featuredOrder` (optional) — Order for featured posts (lower = higher priority)
- `slug` (optional) — Custom URL slug (defaults to filename)

**Categories:**

Categories are automatically determined by folder structure:

```text
content/blog/
├── post-1.mdx              # No category
├── post-2.mdx              # No category
└── tutorials/              # Category: "tutorials"
    ├── getting-started.mdx # Category: "tutorials"
    └── advanced/           # Category: "tutorials/advanced"
        └── deep-dive.mdx   # Category: "tutorials/advanced"
```

See [content/blog/README.md](content/blog/README.md) for detailed documentation.

### Work/Projects (File-based)

Projects are managed as Markdown files in `content/work/`:

1. Create a new `.md` or `.mdx` file in `content/work/`
2. Add frontmatter:

```md
---
title: "Project Title"
description: "Project description"
tags: ["Tag1", "Tag2"]
image: "/images/projects/cover.svg"
github: "https://github.com/user/repo"
demo: "https://demo.example.com"
date: "2025-10-23"
featured: true
status: "completed"
---

## Project Content

Write your project case study here...
```

Projects are automatically loaded and displayed on the `/work` page.

## 🐳 Docker

Container images are built with a multi-stage `Dockerfile` (Next.js standalone output) and a `docker-compose.yml` that exposes development and production-ready profiles.

### Build a production image

```bash
docker compose --profile prod up --build
```

The command builds the image, injects environment variables from `.env`, and serves the app on port `3000`. Override `PORT` or set additional secrets via `docker compose --profile prod run app env` as needed. Ensure the Supabase host defined in `.env` is reachable from inside the container (use `host.docker.internal` when the database runs on the Docker host).

### Run with hot reload during development

```bash
docker compose --profile dev up
```

The development profile mounts the repository into a Node 20 container, installs dependencies (cached in the `node_modules` named volume), and runs `npm run dev` with file watching enabled.

## 🔌 API Endpoints (Optional)

The site works fully static without any API. Optional endpoints are available if you set up a database:

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/api/blog`               | Paginated, filterable list of posts      |
| POST   | `/api/views`              | Increment a post view count              |

**Query parameters for `/api/blog`:**

- `page` — Page number (default: 1)
- `perPage` — Items per page (default: 9)
- `tag` — Filter by tag slug
- `search` — Search in title and excerpt
- `sort` — Sort by `latest` or `views` (default: latest)

## 🧩 UI Components

- **Layout:** `Header`, `Navigation`, `Footer` implement the broadsheet look with datelines and accent separators.
- **Blog:** `BlogGrid`, `BlogCard`, `TagFilter`, `TableOfContents`, `ShareButtons` power the reading experience.
- **Projects:** `ProjectGrid`, `ProjectCard` render feature cards from Markdown sources.
- **UI:** `Button`, `Badge`, `Card`, `Pagination`, `SearchButton`, and `RenderedMarkdown` provide reusable primitives.

## 📄 Deployment

The site is **100% static** and can be deployed anywhere!

### Quick Deploy

**Vercel (Recommended):**

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variable: `NEXT_PUBLIC_SITE_URL="https://yourdomain.com"`
4. Deploy!

**Netlify:**

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variable: `NEXT_PUBLIC_SITE_URL="https://yourdomain.com"`

**Other Platforms:**

- Works with any static host (Cloudflare Pages, GitHub Pages, etc.)
- Build command: `npm run build`
- Output: `.next` (Next.js standalone mode)
- No database required!

### Content Updates

To update content:

1. Edit MDX files in `content/blog/` or `content/work/`
2. Commit and push to your repository
3. Your deployment platform will automatically rebuild and deploy

**SEO Files:**

- Sitemap and robots.txt are automatically generated during build
- They update with each deployment to include new content

## 🤝 Conventions

- TypeScript strict mode is enabled; prefer explicit types
- All markdown rendering passes through sanitizing rehype pipelines before hydration
- Bootstrap styles favor accessible semantic HTML, focus states, and skip links
- **Blog posts are file-based** - MDX files in `content/blog/`
- **Projects are file-based** - Markdown files in `content/work/`
- Use Biome for linting and formatting
- Follow the magazine-inspired design system with serif/sans typography pairings

## 🎨 Features

- **Static Site Generation** - No database, no backend, just pure static files
- **MDX Support** - Rich content with React components
- **Automatic TOC** - Table of contents generated from headings
- **Code Highlighting** - Beautiful code blocks with Shiki
- **Tag System** - Auto-generated from frontmatter, automatically slugified
- **Category System** - Folder-based organization
- **Search & Filter** - Client-side search and tag filtering
- **Related Posts** - Automatic related post suggestions
- **View Tracking** - In-memory view counts (optional database support)
- **SEO Optimized** - Auto-generated sitemap, robots.txt, and metadata
- **Dark Mode** - System-aware theme switching
- **Responsive** - Mobile-first design from 320px to 1440px+

Happy shipping! 📰
