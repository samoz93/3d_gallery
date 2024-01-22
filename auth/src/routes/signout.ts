import { Router } from "express";

const route = Router();

route.post("/signout", (req, res) => {
  req.session = null;
  res.status(200).send({});
});

export { route as signoutRoute };
