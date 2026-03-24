import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productService from "./service.js";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  },
);

export const listProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await productService.listProducts(req.query);

    res.json({
      success: true,
      data: result.products,
      meta: {
        page: result.page,
        total: result.total,
        limit: result.limit,
      },
    });
  },
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.slug);

  res.json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.json({
      success: true,
      data: product,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id);

    res.json({
      success: true,
      data: { message: "Product deleted" },
    });
  },
);

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await productService.getBrands();

  res.json({
    success: true,
    data: brands,
  });
});
