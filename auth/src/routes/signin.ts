import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { MyValidationError } from "../types";
const route = Router();

route.post(
  "/api/users/signin",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isString()
    .isLength({ min: 4, max: 20 })
    .trim()
    .withMessage("Must Have a password"),
  (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new MyValidationError(errors);
    }
    // console.log(email, password);
    const { email, password } = req.body;

    res.send({ email, password });
  }
);

export { route as signinRoute };
