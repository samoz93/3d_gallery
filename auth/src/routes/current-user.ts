import { Router } from "express";
import { currentUser } from "../lib";

const route = Router();

route.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({
    data: req.user,
  });
});

export { route as usersRoute };
