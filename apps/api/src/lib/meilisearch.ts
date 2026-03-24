import { MeiliSearch } from "meilisearch";
import { env } from "../config/index.js";
import { logger } from "./logger.js";

const client = new MeiliSearch({
  host: env.MEILISEARCH_URL,
  apiKey: env.MEILISEARCH_KEY,
});

const PRODUCTS_INDEX = "products";

export async function initMeilisearch() {
  try {
    await client.createIndex(PRODUCTS_INDEX, { primaryKey: "id" });

    await client.index(PRODUCTS_INDEX).updateSettings({
      searchableAttributes: ["name", "description", "brand", "category"],
      filterableAttributes: ["category", "brand", "basePrice", "isActive"],
      sortableAttributes: ["basePrice", "createdAt"],
    });

    logger.info("Meilisearch initialized");
  } catch (error: any) {
    if (error.code !== "index_already_exists") {
      logger.error("Failed to initialize Meilisearch", { error });
    }
  }
}

export async function indexProduct(product: any) {
  const document = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    brand: product.brand,
    basePrice: Number(product.basePrice),
    images: product.images,
    isActive: product.isActive,
    createdAt: product.createdAt?.getTime(),
  };

  await client.index(PRODUCTS_INDEX).addDocuments([document]);
}

export async function deleteProduct(productId: string) {
  await client.index(PRODUCTS_INDEX).deleteDocument(productId);
}

export async function searchProducts(
  query: string,
  options: { category?: string; brand?: string; limit?: number },
) {
  const filters: string[] = ["isActive = true"];

  if (options.category) filters.push(`category = "${options.category}"`);
  if (options.brand) filters.push(`brand = "${options.brand}"`);

  return client.index(PRODUCTS_INDEX).search(query, {
    filter: filters.join(" AND "),
    limit: options.limit || 20,
  });
}

export { client as meilisearchClient };
