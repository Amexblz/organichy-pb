import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
  }

  try {
    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Product, rating, and comment are required" }, { status: 400 });
    }

    // Check if customer actually purchased this product
    const purchaseCount = await prisma.orderItem.count({
      where: {
        productId,
        order: {
          userId: session.userId,
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING"] },
        },
      },
    });

    const isVerifiedPurchase = purchaseCount > 0;

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.userId,
        userName: session.name,
        rating: parseInt(rating),
        title: title || null,
        comment,
        isVerifiedPurchase,
        isApproved: true, // auto approve or pending
      },
    });

    // Recalculate product overall rating and reviewCount
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    console.error("Submit review error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
