import { NextFunction, Request, Response } from "express";
import { NotAuthorized } from "../types";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new NotAuthorized());
  }

  next();
};
