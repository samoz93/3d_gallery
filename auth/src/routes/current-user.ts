import { Router } from "express";

const route = Router();

route.get("/me", (req, res) => {
  res.send({
    data: req.user || null,
  });
});

export { route as usersRoute };
