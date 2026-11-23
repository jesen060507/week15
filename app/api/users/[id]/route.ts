
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

// UPDATE
export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const userId = Number(id);
    const body = await request.json();

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const name = String(body.name ?? "").trim();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!name || !username || !email) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, username, email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengubah akun. Periksa ID atau data duplikat." },
      { status: 400 }
    );
  }
}

// DELETE
export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Akun berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { message: "Gagal menghapus akun" },
      { status: 400 }
    );
  }
}
