import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePathSegments = params.path;
    if (!filePathSegments || filePathSegments.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Prevent directory traversal
    const safePath = filePathSegments.map((seg) => path.basename(seg)).join(path.sep);
    const fullPath = path.join(process.cwd(), "public", "uploads", safePath);

    try {
      const fileBuffer = await fs.readFile(fullPath);
      const ext = path.extname(fullPath).toLowerCase();

      let contentType = "application/octet-stream";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".svg") contentType = "image/svg+xml";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".mp4") contentType = "video/mp4";
      else if (ext === ".webm") contentType = "video/webm";
      else if (ext === ".mov") contentType = "video/quicktime";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return new NextResponse("File not found", { status: 404 });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Static upload serve error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
