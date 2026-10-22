import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const response = NextResponse.json({ settings });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default-settings" },
      update: {
        ...(body.siteName && { siteName: body.siteName }),
        ...(body.logoUrl && { logoUrl: body.logoUrl }),
        ...(body.announcementText !== undefined && { announcementText: body.announcementText }),
        ...(body.announcementActive !== undefined && { announcementActive: Boolean(body.announcementActive) }),
        ...(body.contactEmail && { contactEmail: body.contactEmail }),
        ...(body.contactPhone && { contactPhone: body.contactPhone }),
        ...(body.contactAddress && { contactAddress: body.contactAddress }),
        ...(body.freeShippingThreshold !== undefined && { freeShippingThreshold: parseFloat(body.freeShippingThreshold) }),
        ...(body.standardShippingFee !== undefined && { standardShippingFee: parseFloat(body.standardShippingFee) }),
        ...(body.enableCod !== undefined && { enableCod: Boolean(body.enableCod) }),
        ...(body.enableRazorpay !== undefined && { enableRazorpay: Boolean(body.enableRazorpay) }),
      },
      create: {
        id: "default-settings",
        siteName: body.siteName || "Organichy Peanut Butter",
        announcementText: body.announcementText || "",
        announcementActive: body.announcementActive !== undefined ? Boolean(body.announcementActive) : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "SITE_SETTINGS_UPDATED",
        entity: "SiteSettings",
        entityId: "default-settings",
        detailsJson: JSON.stringify(body),
      },
    });

    // Invalidate full Next.js cache so SSR pages immediately render fresh settings
    revalidatePath("/", "layout");
    revalidatePath("/shop", "page");
    revalidatePath("/cart", "page");
    revalidatePath("/checkout", "page");

    const response = NextResponse.json({ success: true, settings: updated });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
