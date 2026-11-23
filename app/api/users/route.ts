
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

// READ - Menampilkan semua akun
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
