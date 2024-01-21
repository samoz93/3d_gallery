import { Request, Response, Router } from "express";
import { authPayloadVerification, validateRequest } from "../middlewares";
import { getUserByEmail } from "../services";
import { PasswordService } from "../services/password.service";
import { AuthErrors } from "../types";
const route = Router();

route.post(
  "/api/users/signin",
  ...authPayloadVerification,
  validateRequest,
  async (req: Request, res: Response) => {
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
    const jwt = PasswordService.generateJWT(user);

    req.session = {
      ...req.session,
      jwt,
    };

    console.log(req.session);

    return res.status(200).send({
      data: user,
    });
  }
);

export { route as signinRoute };
