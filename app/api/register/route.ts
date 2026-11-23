
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !username || !email || password.length < 8) {
      return NextResponse.json(
        { message: "Lengkapi data dan gunakan password minimal 8 karakter." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Username atau email sudah terdaftar." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Akun berhasil didaftarkan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
