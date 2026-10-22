import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
    ];
  }
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
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
      variants,
      images,
    } = body;

    if (!name || !slug || !categoryId || basePrice === undefined) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || "",
        shortDescription: shortDescription || "",
        categoryId,
        basePrice: parseFloat(basePrice),
        baseMrp: parseFloat(baseMrp || basePrice),
        isFeatured: !!isFeatured,
        isBestseller: !!isBestseller,
        isNewArrival: !!isNewArrival,
        isNatural: !!isNatural,
        isChocolate: !!isChocolate,
        isHighProtein: !!isHighProtein,
        texture: texture || "Crunchy",
        flavor: flavor || "Original",
        ingredients: ingredients || "",
        nutritionPer100g: typeof nutritionPer100g === "object" ? JSON.stringify(nutritionPer100g) : nutritionPer100g,
        benefits: benefits || "",
        directions: directions || "",
        variants: {
          create: (variants || []).map((v: any, index: number) => ({
            weight: v.weight || "1kg",
            flavor: v.flavor || flavor || "Original",
            texture: v.texture || texture || "Crunchy",
            price: parseFloat(v.price || basePrice),
            mrp: parseFloat(v.mrp || baseMrp || basePrice),
            stock: parseInt(v.stock || 50),
            sku: v.sku || `${cleanSlug.slice(0, 10).toUpperCase()}-${v.weight || index}-${Date.now().toString().slice(-4)}`,
          })),
        },
        images: {
          create: (images || []).map((img: any, index: number) => ({
            url: typeof img === "string" ? img : img.url,
            altText: typeof img === "string" ? name : img.altText || name,
            isPrimary: index === 0,
            displayOrder: index,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        detailsJson: JSON.stringify({ name: product.name, slug: product.slug }),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}
