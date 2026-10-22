import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault, addressType } = body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      isDefault: !!isDefault,
      addressType: addressType || "HOME",
    },
  });

  return NextResponse.json({ success: true, address });
}

export async function DELETE(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Address ID required" }, { status: 400 });
  }

  await prisma.address.deleteMany({
    where: { id, userId: session.userId },
  });

  return NextResponse.json({ success: true });
}
