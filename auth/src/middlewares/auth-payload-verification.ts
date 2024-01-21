import { body } from "express-validator";

export const authPayloadVerification = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isString()
    .isLength({ min: 4, max: 20 })
    .trim()
    .withMessage("Must Have a password"),
];
