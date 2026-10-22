import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, currentPassword, newPassword } = body;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (name) updateData.name = name.trim();
  if (phone) updateData.phone = phone.trim();

  if (newPassword) {
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    // If user already has a password, verify current password
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }
      const isMatch = await verifyPassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password does not match" }, { status: 400 });
      }
    }

    // Hash and save new password
    updateData.passwordHash = await hashPassword(newPassword);
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  return NextResponse.json({ success: true, user: updatedUser });
}
