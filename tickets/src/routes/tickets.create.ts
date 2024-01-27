import { needsAuth, validateRequest } from "@samoznew/common";
import { Router } from "express";
import { body } from "express-validator";
import { createTicket } from "../services";
const router = Router();

router.post(
  "",
  needsAuth,
  ...[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req, res) => {
    const { title, price } = req.body;
    const ticket = await createTicket({
      title,
      price,
      userId: req.user!.id,
    });

    res.status(201).json({ data: ticket });
  }
);

export { router as createTicketRouter };
