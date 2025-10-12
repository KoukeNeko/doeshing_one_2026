import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  // 使用環境變數中的管理員 Email，如果沒有則使用預設值
  const adminEmail = process.env.ADMIN_EMAIL || "hello@doeshing.com";
  const authorName = process.env.AUTHOR_NAME || "Doeshing";

  console.log(`📝 Creating author with email: ${adminEmail}`);

  const user = await prisma.user.create({
    data: {
      name: authorName,
      email: adminEmail,
      image: "/images/avatar.svg",
    },
  });

  const author = await prisma.author.create({
    data: {
      name: authorName,
      email: adminEmail,
      avatar: "/images/avatar.svg",
      bio: "Creative technologist crafting editorials in the browser. Exploring the sweet spot between storytelling, design, and modern web tooling.",
      userId: user.id,
    },
  });

  console.log(`✅ Author created: ${author.name} (${author.email})`);

  const tagNames = [
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Design", slug: "design" },
    { name: "Prisma", slug: "prisma" },
  ];

  await Promise.all(
    tagNames.map(({ name, slug }) =>
      prisma.tag.create({
        data: {
          name,
          slug,
        },
      }),
    ),
  );

  const postSeed = [
    {
      title: "Designing the Editorial Web in 2026",
      coverImage: "/images/blog/editorial-web.svg",
      excerpt:
        "A behind-the-scenes walkthrough of the creative direction, typography choices, and responsive systems powering this magazine-style site.",
      content: `
## From Newsprint to Pixels

The newspaper aesthetic has always felt like home—structured, rhythmic, and bold. This redesign embraces sharp grids and generous white space to give long-form storytelling space to breathe.

### The Framework Stack

- **Next.js 15** handles the hybrid rendering for fast, reliable delivery.
- **Tailwind CSS** gives full control over the layout scales.
- **Prisma** keeps the content workflow consistent across Postgres and MDX sources.

> Great editorial design is choreography. Each block of content has a role to play.

## Designing for Motion

A publication breathes through subtle motion. Scroll-based parallax, offset grids, and accent color cues lead the reader from headline to tagline. The small touches build trust, one piece at a time.
`,
      published: true,
      tags: ["nextjs", "design", "typescript"],
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
      title: "Crafting Structured Content Pipelines",
      coverImage: "/images/blog/content-pipeline.svg",
      excerpt:
        "How markdown projects, database-driven posts, and editorial tooling feed into a cohesive developer experience.",
      content: `
## A Two-Track Publishing Flow

Projects live as Markdown files, empowering long-form documentation with MDX-powered callouts. Meanwhile, quick news and updates flow through Prisma-managed posts, optimized for scheduling and tagging.

### Content Lifecycle

1. Draft in Notion or Obsidian
2. Convert to MDX with frontmatter
3. Publish via Git or the upcoming admin panel

The editorial workflow leans on automation without losing the handcrafted feel of a magazine.
`,
      published: true,
      tags: ["prisma", "design"],
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    },
    {
      title: "Typography Systems for Modern Editorial Sites",
      coverImage: "/images/blog/typography-systems.svg",
      excerpt:
        "Pairing serif headlines with sans-serif body copy is a decades-old tradition. Here's how it translates to the digital canvas.",
      content: `
## Serif Meets Sans

Playfair Display brings the elegance. Inter keeps paragraphs legible. This mix mirrors the balance of large, attention-grabbing headlines and compact supporting stories you'd expect in a weekend edition.

### Rhythm and Hierarchy

- Drop caps signal feature reads.
- Tight letter spacing adds gravitas to headlines.
- Accent color rules guide the eye without overwhelming.

In short, thoughtful typography does the heavy lifting for tone and clarity.
`,
      published: true,
      tags: ["design", "nextjs"],
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 21)),
    },
  ];

  for (const post of postSeed) {
    await prisma.post.create({
      data: {
        slug: slugify(post.title),
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        published: post.published,
        publishedAt: post.publishedAt,
        author: {
          connect: { id: author.id },
        },
        tags: {
          connect: post.tags.map((tag) => ({
            slug: tag,
          })),
        },
      },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
