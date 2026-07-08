import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    // Only save known keys
    const allowed = Object.keys(DEFAULT_SETTINGS);
    const filtered: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) {
        filtered[key] = body[key];
      }
    }
    await saveSettings(filtered);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
