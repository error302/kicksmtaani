import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  CreateProductInput,
  UpdateProductInput,
} from "./schema.js";
import * as productRepo from "./repository.js";
import { logger } from "../../lib/logger.js";

export async function createProduct(input: CreateProductInput) {
  const data = createProductSchema.parse(input);

  const product = await productRepo.createProduct({
    ...data,
    basePrice: data.basePrice,
  });

  logger.info("Product created", { productId: product.id, name: product.name });

  return product;
}

export async function listProducts(query: any) {
  const data = productQuerySchema.parse(query);
  return productRepo.getProducts(data);
}

export async function getProduct(slugOrId: string) {
  const product =
    (await productRepo.getProductBySlug(slugOrId)) ||
    (await productRepo.getProductById(slugOrId));

  if (!product) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Product not found" };
  }

  return product;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const data = updateProductSchema.parse(input);

  const product = await productRepo.updateProduct(id, data);

  logger.info("Product updated", { productId: id });

  return product;
}

export async function deleteProduct(id: string) {
  await productRepo.deleteProduct(id);

  logger.info("Product deleted (soft)", { productId: id });
}

export async function getBrands() {
  return productRepo.getAllBrands();
}
