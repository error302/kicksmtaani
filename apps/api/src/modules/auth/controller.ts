import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: { user: result.user, accessToken: result.accessToken },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const profile = await authService.getProfile(user.userId);

  res.json({
    success: true,
    data: profile,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.json({
    success: true,
    data: { message: "Logged out successfully" },
  });
});
