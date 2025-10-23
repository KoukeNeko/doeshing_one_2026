# Doeshing — Editorial Portfolio

Magazine-style personal site built with Next.js 15, Tailwind CSS, and static MDX content. The experience blends broadsheet-inspired layouts with modern web tooling to showcase blog posts, case studies, a résumé, and contact information.

## ✨ Highlights

- Multi-column editorial layout with serif/sans typography pairings and accent red detailing
- **Static MDX blog system** with search, tag filters, subcategory support, and related articles
- Markdown-driven project case studies rendered via a unified/rehype pipeline
- Comprehensive CV page with printable styles and timeline layout
- API routes for blog listing and view tracking
- Accessible navigation, skip links, responsive design from 320px to 1440px+

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 3 with typography plugin and custom magazine tokens
- **Content:** Static MDX files for blog posts and projects (no database required!)
- **Auth Ready:** Prisma schema available for future admin tooling (optional)
- **Tooling:** TypeScript, Biome, Zod, unified/remark/rehype, Shiki

## 📁 Project Structure

```
src/
  app/                App Router pages + API routes
    archive/          Blog list + detail + loading state
    work/             Project list + detail driven by Markdown content
    about/            CV/résumé page
    contact/          Contact info + clipboard helper
    api/              REST endpoints for blog listing + view tracking
  components/         Layout, blog, project, and UI primitives
  lib/                MDX utilities, markdown rendering, data helpers
  styles/             Tailwind global layers
  types/              Shared type definitions
content/
  blog/               MDX blog posts (supports subcategories)
  work/               Markdown case studies (frontmatter + prose)
prisma/               Prisma schema (optional, for future admin features)
public/images/        Editorial placeholder artwork + icons
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables (Optional)

For basic usage, the site works without any configuration. For production deployment:

```bash
# Create .env file
echo 'NEXT_PUBLIC_SITE_URL="https://yourdomain.com"' > .env
```

- `NEXT_PUBLIC_SITE_URL` — public base URL used for metadata + sharing (default: http://localhost:3000)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — optional, for future admin features
- `DATABASE_URL` — optional, only needed if you want to use Prisma for admin features

### 3. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to explore the editorial layout. Biome linting keeps formatting consistent:

```bash
npm run lint
npm run format
```

## 📝 Content Authoring

- **Blog posts:** Add `.mdx` files to `content/blog/`. Supports subcategories via folders (e.g., `content/blog/tutorials/post.mdx`). Frontmatter supports `{ title, excerpt, coverImage, date, author, tags, published, featured, category }`. Content is rendered with typographic enhancements, Shiki-powered code blocks, and automatic table of contents generation. See `content/blog/README.md` for detailed documentation.
- **Projects:** Add `.md` or `.mdx` files to `content/work/`. Frontmatter supports `{ title, description, tags, image, github, demo, date, featured, status }`. Content is processed through unified/remark/rehype for typography, code highlighting, and TOC data.

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

## 🔌 API Endpoints

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/api/blog`               | Paginated, filterable list of posts      |
| POST   | `/api/views`              | Increment a post view count              |

Query parameters for the list endpoint mirror the UI: `page`, `tag`, `search`, `sort=latest|views`, `perPage`.

**Note:** POST/PUT/DELETE endpoints for blog management are disabled. Blog posts are now managed as static MDX files in `content/blog/`.

## 🧩 UI Components

- **Layout:** `Header`, `Navigation`, `Footer` implement the broadsheet look with datelines and accent separators.
- **Blog:** `BlogGrid`, `BlogCard`, `TagFilter`, `TableOfContents`, `ShareButtons` power the reading experience.
- **Projects:** `ProjectGrid`, `ProjectCard` render feature cards from Markdown sources.
- **UI:** `Button`, `Badge`, `Card`, `Pagination`, `SearchButton`, and `RenderedMarkdown` provide reusable primitives.

## 📄 Deployment Notes

- **No database required!** Blog content is static and builds directly into the site.
- Tailwind + typography plugin is fully static and deployment ready for Vercel, Netlify, or any static host.
- Set `NEXT_PUBLIC_SITE_URL` to your deployed host URL to ensure accurate Open Graph links.
- Content updates require a rebuild (push to git to trigger automatic deployment on Vercel/Netlify).
- Optional: Prisma schema is available if you want to add admin features in the future.

## 🤝 Conventions

- TypeScript strict mode is enabled; prefer explicit types.
- All markdown rendering passes through sanitizing rehype pipelines before hydration.
- Boostrapped styles favor accessible semantic HTML, focus states, and skip links.
- Blog posts are managed as MDX files in `content/blog/` - no CMS needed!

Happy shipping! 📰
