import { Router } from "express";

const route = Router();

route.get("/api/users/currentuser", (req, res) => {
  res.send("Hi there Current!");
});

export { route as usersRoute };
