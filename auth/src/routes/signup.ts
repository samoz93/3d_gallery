import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import { createUser, isUserExist } from "../services";
import { UserExists } from "../types";
const route = Router();

route.post(
  "/api/users/signup",
  body("email").isEmail().trim().withMessage("Email must be valid"),
  body("password")
    .isString()
    .isLength({ min: 4, max: 20 })
    .trim()
    .withMessage("Must Have a password"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;
    const userExists = await isUserExist(email);

    if (userExists) {
      throw new UserExists(email);
    }

    const user = await createUser(email, password);

    const jwt = user.generateJWT();
    req.session = {
      ...req.session,
      jwt,
    };
    return res.status(201).send({
      data: user.toJSON(),
    });
  }
);

export { route as signupRoute };
