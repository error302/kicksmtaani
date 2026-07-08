// Seed an admin user for the KicksMtaani admin dashboard
// Run with: bun scripts/seed-admin.ts
//
// Default credentials:
//   Email: admin@kicksmtaani.co.ke
//   Password: admin12345

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "admin@kicksmtaani.co.ke";
  const password = "admin12345";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await db.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      email,
      passwordHash,
      fullName: "KicksMtaani Admin",
      phone: "+254700000000",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user ready:");
  console.log("   Email:", admin.email);
  console.log("   Password:", password);
  console.log("   Role:", admin.role);
}

main()
  .catch((e) => {
    console.error("Seed admin failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
