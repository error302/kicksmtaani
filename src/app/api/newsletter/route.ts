import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
