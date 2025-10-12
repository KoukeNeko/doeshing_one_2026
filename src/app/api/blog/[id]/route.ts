import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const updatePostSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      tags: true,
      author: true,
    },
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const payload = await request.json();
  const parsed = updatePostSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { tags, ...data } = parsed.data;

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const publishedAtUpdate =
    data.published && !post.published ? new Date() : undefined;

  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      ...data,
      publishedAt: publishedAtUpdate ?? post.publishedAt,
      tags: tags
        ? {
            set: tags.map((slug) => ({ slug })),
          }
        : undefined,
    },
    include: {
      tags: true,
      author: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    throw error;
  }
}
