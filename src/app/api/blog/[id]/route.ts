import { NextResponse } from "next/server";

// Note: These endpoints are disabled for static MDX blog.
// To edit blog posts, modify MDX files in content/blog/

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  
  return NextResponse.json(
    { 
      message: "Blog posts are now managed as static MDX files. Use the slug to access posts at /blog/[slug]",
      id,
      hint: "Edit content/blog/*.mdx files to update posts."
    },
    { status: 501 }
  );
}

export async function PUT(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  
  return NextResponse.json(
    { 
      message: "Blog posts are now managed as static MDX files. Please edit the MDX file directly.",
      id,
      hint: "Edit content/blog/*.mdx files to update posts."
    },
    { status: 501 }
  );
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  
  return NextResponse.json(
    { 
      message: "Blog posts are now managed as static MDX files. Please delete the MDX file directly.",
      id,
      hint: "Delete the corresponding .mdx file in content/blog/ to remove a post."
    },
    { status: 501 }
  );
}
