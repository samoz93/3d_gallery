import { Router } from "express";
import { PasswordService } from "../services/password.service";
import { _ } from "../utils";

const route = Router();

route.get("/api/users/currentuser", (req, res) => {
  const { jwt } = req.session || {};

  if (_.isEmpty(jwt)) {
    return res.status(200).send({
      data: null,
    });
  }

  res.send({
    data: PasswordService.DecodeJWT(jwt),
  });
});

export { route as usersRoute };
