import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sneakroom.co.ke" },
    update: {},
    create: {
      email: "admin@sneakroom.co.ke",
      phone: "+254712000001",
      passwordHash: adminPassword,
      fullName: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash("customer123456", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      phone: "+254712000002",
      passwordHash: customerPassword,
      fullName: "Demo Customer",
      role: "CUSTOMER",
    },
  });
  console.log("✅ Customer user created:", customer.email);

  // Create sample products
  const products = [
    {
      name: "Nike Air Max 90",
      slug: "nike-air-max-90",
      description:
        "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays, and classic TPU details.",
      category: "MEN" as const,
      brand: "Nike",
      basePrice: 15999,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      ],
      variants: [
        { size: "40", sku: "NAM90-MEN-40", stockQty: 10 },
        { size: "41", sku: "NAM90-MEN-41", stockQty: 15 },
        { size: "42", sku: "NAM90-MEN-42", stockQty: 20 },
        { size: "43", sku: "NAM90-MEN-43", stockQty: 12 },
        { size: "44", sku: "NAM90-MEN-44", stockQty: 8 },
      ],
    },
    {
      name: "Adidas Ultraboost",
      slug: "adidas-ultraboost",
      description:
        "These running shoes deliver incredible energy return. The responsive Boost midsole cushioning will keep your feet comfortable all day.",
      category: "MEN" as const,
      brand: "Adidas",
      basePrice: 21999,
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
      ],
      variants: [
        { size: "40", sku: "AUB-MEN-40", stockQty: 8 },
        { size: "41", sku: "AUB-MEN-41", stockQty: 12 },
        { size: "42", sku: "AUB-MEN-42", stockQty: 18 },
        { size: "43", sku: "AUB-MEN-43", stockQty: 10 },
      ],
    },
    {
      name: "Nike Air Force 1",
      slug: "nike-air-force-1",
      description:
        "The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best.",
      category: "WOMEN" as const,
      brand: "Nike",
      basePrice: 13999,
      images: [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
      ],
      variants: [
        { size: "36", sku: "NAF1-WOM-36", stockQty: 10 },
        { size: "37", sku: "NAF1-WOM-37", stockQty: 15 },
        { size: "38", sku: "NAF1-WOM-38", stockQty: 20 },
        { size: "39", sku: "NAF1-WOM-39", stockQty: 18 },
      ],
    },
    {
      name: "New Balance 574",
      slug: "new-balance-574",
      description:
        "The 574 is the embodiment of classic New Balance style. It's versatile, comfortable, and has a timeless look.",
      category: "BOYS" as const,
      brand: "New Balance",
      basePrice: 9999,
      images: [
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600",
      ],
      variants: [
        { size: "36", sku: "NB574-BOY-36", stockQty: 12 },
        { size: "37", sku: "NB574-BOY-37", stockQty: 15 },
        { size: "38", sku: "NB574-BOY-38", stockQty: 20 },
      ],
    },
    {
      name: "Converse Chuck Taylor",
      slug: "converse-chuck-taylor",
      description:
        "The original basketball sneaker, the Chuck Taylor All Star has become an iconic casual shoe.",
      category: "GIRLS" as const,
      brand: "Converse",
      basePrice: 6999,
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9eb2fad643?w=600",
      ],
      variants: [
        { size: "34", sku: "CCT-GIR-34", stockQty: 8 },
        { size: "35", sku: "CCT-GIR-35", stockQty: 12 },
        { size: "36", sku: "CCT-GIR-36", stockQty: 15 },
        { size: "37", sku: "CCT-GIR-37", stockQty: 10 },
      ],
    },
    {
      name: "Nike Revolution 6",
      slug: "nike-revolution-6",
      description:
        "Kids' running shoes with soft foam cushioning for a smooth ride.",
      category: "KIDS" as const,
      brand: "Nike",
      basePrice: 4999,
      images: [
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600",
      ],
      variants: [
        { size: "28", sku: "NR6-KID-28", stockQty: 15 },
        { size: "30", sku: "NR6-KID-30", stockQty: 20 },
        { size: "32", sku: "NR6-KID-32", stockQty: 25 },
        { size: "34", sku: "NR6-KID-34", stockQty: 18 },
      ],
    },
  ];

  for (const product of products) {
    const { variants, ...productData } = product;
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    });
    console.log("✅ Product created:", createdProduct.name);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Admin:    admin@sneakroom.co.ke / admin123456");
  console.log("   Customer: customer@example.com / customer123456");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
