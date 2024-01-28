import cookieSession from "cookie-session";
// import cors from "cors";
import {
  MyError,
  NotFoundError,
  currentUserMiddleWare,
} from "@samoznew/common";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  json,
} from "express";
import "express-async-errors";
import { CONFIG } from "./config";
import { createTicketRouter, getTicketsRouter } from "./routes";
import { passwordManager } from "./utils";
const routes: any[] = [createTicketRouter, getTicketsRouter];

const middleWares: RequestHandler[] = [
  // cors(),
  json(),
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  }),
  currentUserMiddleWare(passwordManager),
];

const app = express();
app.set("trust proxy", true);

// Apply middleWares
middleWares.forEach((middleWare) => app.use(middleWare));

// Setup routes
routes.forEach((route) => app.use("/api/tickets", route));

// Not found routes and error handling
app.use("*", (req, res, next) => {
  // res.json({ user: req.user, hi: "hi" });
  next(new NotFoundError());
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MyError) {
    return res.status(err.statusCode).send({
      error: err.serializeErrors(),
      logs: CONFIG.isDev && err,
    });
  }
  res.status(400).send({
    error: { message: "Something went wrong" },
    logs: CONFIG.isDev && err,
  });
});

export { app };
