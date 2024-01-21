import { Router } from "express";

const route = Router();

route.post("/api/users/signout", (req, res) => {
  res.send("Hi there SignOut!");
});

export { route as signoutRoute };
