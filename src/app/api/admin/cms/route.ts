import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "about-us";

  const page = await prisma.cMSPage.findUnique({
    where: { slug },
  });

  return NextResponse.json({ page });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, title, content } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const updated = await prisma.cMSPage.upsert({
    where: { slug },
    update: {
      ...(title && { title }),
      ...(content && { content }),
    },
    create: {
      slug,
      title: title || slug,
      content: content || "",
      published: true,
    },
  });

  return NextResponse.json({ success: true, page: updated });
}
