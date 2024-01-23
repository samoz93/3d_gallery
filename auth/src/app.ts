import cookieSession from "cookie-session";
// import cors from "cors";
import express, { RequestHandler, json } from "express";
import "express-async-errors";
import { currentUser } from "./lib";
import { errorHandler } from "./middlewares";
import { signinRoute, signoutRoute, signupRoute, usersRoute } from "./routes";
import { NotFoundError } from "./types";
const routes = [usersRoute, signinRoute, signoutRoute, signupRoute];

const middleWares: RequestHandler[] = [
  // cors(),
  json(),
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  }),
  currentUser,
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
