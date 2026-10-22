import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const videos = await prisma.advertisementVideo.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error("Fetch admin videos error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, videoUrl, thumbnailUrl, productLink, tagText, displayOrder, active } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: "Title and Video URL are required" }, { status: 400 });
    }

    const video = await prisma.advertisementVideo.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : null,
        productLink: productLink ? productLink.trim() : "/shop",
        tagText: tagText ? tagText.trim() : "FEATURED PRODUCT",
        displayOrder: Number(displayOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error: any) {
    console.error("Create video error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, videoUrl, thumbnailUrl, productLink, tagText, displayOrder, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl.trim();
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl ? thumbnailUrl.trim() : null;
    if (productLink !== undefined) updateData.productLink = productLink ? productLink.trim() : "/shop";
    if (tagText !== undefined) updateData.tagText = tagText ? tagText.trim() : "FEATURED PRODUCT";
    if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder) || 0;
    if (active !== undefined) updateData.active = Boolean(active);

    const video = await prisma.advertisementVideo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, video });
  } catch (error: any) {
    console.error("Update video error:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    await prisma.advertisementVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error: any) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
