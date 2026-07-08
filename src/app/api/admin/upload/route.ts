import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadImage(buffer, { folder: "kicksmtaani/products" });
    return NextResponse.json({
      ok: true,
      url: result.url,
      publicId: result.publicId,
      demoMode: result.demoMode,
      cloudinaryConfigured: isCloudinaryConfigured,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
