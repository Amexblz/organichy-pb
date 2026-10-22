import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      variants: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      categoryId,
      basePrice,
      baseMrp,
      isFeatured,
      isBestseller,
      isNewArrival,
      isNatural,
      isChocolate,
      isHighProtein,
      texture,
      flavor,
      ingredients,
      nutritionPer100g,
      benefits,
      directions,
      active,
      images,
    } = body;

    // Update product images if provided in payload
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: params.id,
            url: typeof img === "string" ? img : img.url,
            altText: typeof img === "string" ? name || "Product photo" : img.altText || name || "Product photo",
            isPrimary: img.isPrimary !== undefined ? !!img.isPrimary : idx === 0,
            displayOrder: idx,
          })),
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(categoryId && { categoryId }),
        ...(basePrice !== undefined && { basePrice: parseFloat(basePrice) }),
        ...(baseMrp !== undefined && { baseMrp: parseFloat(baseMrp) }),
        ...(isFeatured !== undefined && { isFeatured: !!isFeatured }),
        ...(isBestseller !== undefined && { isBestseller: !!isBestseller }),
        ...(isNewArrival !== undefined && { isNewArrival: !!isNewArrival }),
        ...(isNatural !== undefined && { isNatural: !!isNatural }),
        ...(isChocolate !== undefined && { isChocolate: !!isChocolate }),
        ...(isHighProtein !== undefined && { isHighProtein: !!isHighProtein }),
        ...(texture && { texture }),
        ...(flavor && { flavor }),
        ...(ingredients !== undefined && { ingredients }),
        ...(nutritionPer100g !== undefined && {
          nutritionPer100g: typeof nutritionPer100g === "object" ? JSON.stringify(nutritionPer100g) : nutritionPer100g,
        }),
        ...(benefits !== undefined && { benefits }),
        ...(directions !== undefined && { directions }),
        ...(active !== undefined && { active: !!active }),
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: params.id,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "PRODUCT_DELETED",
        entity: "Product",
        entityId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
