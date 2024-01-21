import { NextFunction, Request, Response } from "express";
import { MyError } from "../types";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof MyError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }
  console.error(err);
  res.status(400).send([{ message: "Something went wrong" }]);
};
