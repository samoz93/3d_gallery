import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { PasswordService } from "../services/password.service";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jwt } = req.session || {};

  if (!jwt) {
    return next();
  }

  try {
    req.user = PasswordService.decodeJWT(jwt) || null;
  } catch (error) {}

  return next();
};
