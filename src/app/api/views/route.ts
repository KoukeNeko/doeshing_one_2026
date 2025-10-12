import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementPostViews } from "@/lib/blog";

const viewSchema = z.object({
  postId: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = viewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 422 });
  }

  await incrementPostViews(parsed.data.postId);

  return NextResponse.json({ success: true });
}
