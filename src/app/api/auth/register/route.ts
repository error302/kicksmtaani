import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, phone } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be 6+ characters" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName: fullName || null,
        phone: phone || null,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
