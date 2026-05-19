import "dotenv/config";
import { prisma } from "@kicksmtaani/db";
import { indexProduct, initMeilisearch } from "../lib/meilisearch";
import { logger } from "../lib/logger";

async function sync() {
  console.log("🔍 Starting Meilisearch sync...");
  
  // Ensure index and settings are initialized
  await initMeilisearch();

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true }
  });

  console.log(`📦 Found ${products.length} products to index.`);

  for (const product of products) {
    try {
      await indexProduct(product);
      console.log(`✅ Indexed: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to index ${product.name}:`, error);
    }
  }

  console.log("🎉 Sync complete!");
  process.exit(0);
}

sync().catch((err) => {
  console.error("💥 Sync failed:", err);
  process.exit(1);
});
