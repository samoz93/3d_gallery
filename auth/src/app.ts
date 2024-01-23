import cookieSession from "cookie-session";
// import cors from "cors";
import {
  NotFoundError,
  currentUserMiddleWare,
  errorHandler,
} from "@samoznew/common";
import express, { RequestHandler, json } from "express";
import "express-async-errors";
import { CONFIG } from "./config";
import { signinRoute, signoutRoute, signupRoute, usersRoute } from "./routes";
const routes = [usersRoute, signinRoute, signoutRoute, signupRoute];

const middleWares: RequestHandler[] = [
  // cors(),
  json(),
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  }),
  currentUserMiddleWare(CONFIG.JWT_KEY),
];

const app = express();
app.set("trust proxy", true);

// Apply middleWares
middleWares.forEach((middleWare) => app.use(middleWare));

// Setup routes
routes.forEach((route) => app.use("/api/users", route));

// Not found routes and error handling
app.use("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
