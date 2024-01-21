import to from "await-to-js";
import cookieSession from "cookie-session";
import express, { RequestHandler, json } from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { CONFIG } from "./config";
import { currentUser } from "./lib";
import { errorHandler } from "./middlewares";
import { signinRoute, signoutRoute, signupRoute, usersRoute } from "./routes";
import { NotFoundError } from "./types";

const routes = [usersRoute, signinRoute, signoutRoute, signupRoute];

const middleWares: RequestHandler[] = [
  json(),
  cookieSession({
    signed: false,
    secure: true,
  }),
  currentUser,
];

const app = express();
app.set("trust proxy", true);

// Apply middleWares
middleWares.forEach((middleWare) => app.use(middleWare));

// Setup routes
routes.forEach((route) => app.use(route));

// Not found routes and error handling
app.use("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

const init = async () => {
  const [err] = await to(mongoose.connect(CONFIG.MONGO_URI));
  if (err) {
    console.log("DB ERRORS", err);
    return;
  }

  app.listen(3010, () => {
    console.log("Listening on port 3010");
  });
};

init();
