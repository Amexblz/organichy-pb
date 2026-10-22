import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subtitle, image, mobileImage, link, ctaText, badgeText, type, displayOrder, isActive } = body;

    if (!title || !image) {
      return NextResponse.json({ error: "Banner title and image URL are required" }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        image: image.trim(),
        mobileImage: mobileImage ? mobileImage.trim() : null,
        link: link ? link.trim() : "/shop",
        ctaText: ctaText ? ctaText.trim() : "SHOP NOW",
        badgeText: badgeText ? badgeText.trim() : null,
        type: type || "HERO",
        displayOrder: parseInt(displayOrder || 0),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (err: any) {
    console.error("Create banner error:", err);
    return NextResponse.json({ error: err.message || "Failed to create banner" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, subtitle, image, mobileImage, link, ctaText, badgeText, type, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle ? subtitle.trim() : null;
    if (image !== undefined) updateData.image = image.trim();
    if (mobileImage !== undefined) updateData.mobileImage = mobileImage ? mobileImage.trim() : null;
    if (link !== undefined) updateData.link = link.trim();
    if (ctaText !== undefined) updateData.ctaText = ctaText.trim();
    if (badgeText !== undefined) updateData.badgeText = badgeText ? badgeText.trim() : null;
    if (type !== undefined) updateData.type = type;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, banner });
  } catch (err: any) {
    console.error("Update banner error:", err);
    return NextResponse.json({ error: err.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
  }

  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete banner error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete banner" }, { status: 500 });
  }
}
