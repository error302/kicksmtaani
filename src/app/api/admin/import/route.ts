import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Papa from "papaparse";

/**
 * CSV import endpoint — bulk create products from a CSV file.
 * Expected columns: name, brandSlug, category, description, basePrice, compareAt,
 *                   images (| separated URLs), sizes (| separated), colors (name:hex; name:hex),
 *                   isFeatured, isNew, stockQty, tags (| separated)
 */
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
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (parsed.errors.length) {
      console.warn("CSV parse warnings:", parsed.errors);
    }
    const rows = parsed.data as any[];

    // Cache brands
    const brands = await db.brand.findMany();
    const brandBySlug = new Map(brands.map((b) => [b.slug, b.id]));

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const brandId = brandBySlug.get(row.brandSlug);
        if (!brandId) {
          skipped++;
          errors.push(`Row ${created + skipped + 1}: brand "${row.brandSlug}" not found`);
          continue;
        }
        if (!row.name || !row.basePrice) {
          skipped++;
          errors.push(`Row ${created + skipped + 1}: missing name or price`);
          continue;
        }
        let slug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const existing = await db.product.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now().toString(36)}`;

        const images = row.images ? row.images.split("|").map((s: string) => s.trim()).filter(Boolean) : [];
        const sizes = row.sizes ? row.sizes.split("|").map((s: string) => s.trim()).filter(Boolean) : [];
        const colors = row.colors
          ? row.colors.split(";").map((s: string) => {
              const [name, hex] = s.split(":").map((x) => x.trim());
              return { name: name || "Default", hex: hex || "#000000" };
            })
          : [];
        const tags = row.tags ? row.tags.split("|").map((s: string) => s.trim()).filter(Boolean) : [];

        await db.product.create({
          data: {
            name: row.name,
            slug,
            brandId,
            category: row.category || "UNISEX",
            description: row.description || null,
            basePrice: Number(row.basePrice),
            compareAt: row.compareAt ? Number(row.compareAt) : null,
            images: JSON.stringify(images),
            sizes: JSON.stringify(sizes),
            colors: JSON.stringify(colors),
            isFeatured: row.isFeatured === "true" || row.isFeatured === "1",
            isNew: row.isNew === "true" || row.isNew === "1",
            stockQty: row.stockQty ? Number(row.stockQty) : 0,
            inStock: true,
            tags: tags.length ? JSON.stringify(tags) : null,
          },
        });
        created++;
      } catch (e: any) {
        skipped++;
        errors.push(`Row ${created + skipped + 1}: ${e.message}`);
      }
    }

    return NextResponse.json({
      ok: true,
      created,
      skipped,
      errors: errors.slice(0, 20),
      total: rows.length,
    });
  } catch (e: any) {
    console.error("Import error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
