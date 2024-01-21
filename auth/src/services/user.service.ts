import to from "await-to-js";
import { UserModel } from "../models";
import { DBError } from "../types";
import { _ } from "../utils";

export const isUserExist = async (email: string) => {
  const [err, user] = await to(UserModel.findOne({ email }));
  if (err) {
    throw new DBError(err);
  }
  return !!user;
};

export const createUser = async (email: string, password: string) => {
  const [err, user] = await to(
    UserModel.create({
      email,
      password,
    })
  );

  if (err || !user) {
    throw new DBError(err);
  }

  return _.omit(user.toJSON(), ["password"]);
};
