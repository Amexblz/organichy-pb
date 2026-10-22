import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No video file uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
    await fs.mkdir(uploadDir, { recursive: true });

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase() || ".mp4";
    const allowedExtensions = [".mp4", ".webm", ".mov", ".m4v", ".ogg"];

    if (!allowedExtensions.includes(ext) && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid video format. Supported formats: MP4, WEBM, MOV, M4V" },
        { status: 400 }
      );
    }

    const safeBase = originalName
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 24);

    const uniqueName = `adv_${Date.now()}_${safeBase}_${Math.random().toString(36).slice(2, 7)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/videos/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    });
  } catch (error: any) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload video" },
      { status: 500 }
    );
  }
}
