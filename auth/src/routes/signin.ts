import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import { getUserByEmail } from "../services";
import { AuthErrors } from "../types";
const route = Router();

route.post(
  "/api/users/signin",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isString()
    .isLength({ min: 4, max: 20 })
    .trim()
    .withMessage("Must Have a password"),
  validateRequest,
  async (req: Request, res: Response, next) => {
    // console.log(email, password);
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new AuthErrors();
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthErrors();
    }
    const jwt = user.generateJWT();
    req.session = {
      ...req.session,
      jwt,
    };

    return res.status(200).send({
      data: user,
    });
  }
);

export { route as signinRoute };
