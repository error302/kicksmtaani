import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export interface RequestWithId extends Request {
  id: string;
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  (req as RequestWithId).id =
    (req.headers["x-request-id"] as string) || uuidv4();
  res.setHeader("x-request-id", (req as RequestWithId).id);
  next();
}
