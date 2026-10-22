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
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (singleFile) allFiles.push(singleFile);
    if (files && files.length > 0) {
      for (const f of files) {
        if (!allFiles.includes(f)) allFiles.push(f);
      }
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });

    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"];
    const uploadedImages = [];

    for (const file of allFiles) {
      const originalName = file.name;
      const ext = path.extname(originalName).toLowerCase() || ".png";

      if (!allowedExtensions.includes(ext) && !file.type.startsWith("image/")) {
        continue;
      }

      const safeBase = originalName
        .replace(ext, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 20);
      const uniqueName = `prod_${Date.now()}_${safeBase}_${Math.random().toString(36).slice(2, 7)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/products/${uniqueName}`;
      uploadedImages.push({
        url: publicUrl,
        altText: safeBase.replace(/-/g, " ") || "Product photo",
        filename: uniqueName,
      });
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: "Invalid image format. Supported formats: PNG, JPG, JPEG, WEBP, AVIF" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      // convenience for single file uploads
      url: uploadedImages[0].url,
      altText: uploadedImages[0].altText,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
