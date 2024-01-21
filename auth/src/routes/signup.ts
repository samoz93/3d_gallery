import { Router } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";
import { createUser, isUserExist } from "../services";
import { MyValidationError, UserExists } from "../types";
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

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new MyValidationError(errors);
    }

    const { email, password } = req.body;
    const userExists = await isUserExist(email);

    if (userExists) {
      throw new UserExists(email);
    }

    const user = await createUser(email, password);

    const userJwt = jwt.sign(user, CONFIG.JWT_KEY);
    req.session = {
      ...req.session,
      jwt: userJwt,
    };
    return res.status(201).send({
      data: user,
    });
  }
);

export { route as signupRoute };
