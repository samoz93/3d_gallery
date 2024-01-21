import { Request, Response } from "express";
import { UserModel } from "../models";

export const UserJwtDecoder = (req: Request, res: Response) => {
  const { jwt } = req.session || {};

  if (_.isEmpty(jwt)) {
    return res.status(200).send({
      data: null,
    });
  }

  res.send({
    data: UserModel.decodeJWT(jwt),
  });
};
