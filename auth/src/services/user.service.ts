import { DBError } from "@samoznew/common";
import to from "await-to-js";
import { UserModel } from "../models";

export const isUserExist = async (email: string) => {
  const [err, user] = await to(UserModel.findOne({ email }));
  if (err) {
    throw new DBError(err);
  }
  return !!user;
};

export const getUserByEmail = async (email: string) => {
  const [err, user] = await to(UserModel.findOne({ email }).exec());
  if (err) {
    throw new DBError(err);
  }

  return user;
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

  return user;
};
