import { AuthErrors, needsAuth, validateRequest } from "@samoznew/common";
import { Router } from "express";
import { body } from "express-validator";
import { createTicket, getTicketById, updateTicket } from "../services";
const router = Router();
const basicValidation = [
  needsAuth,
  ...[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
];

router.post("/", ...basicValidation, async (req, res) => {
  const { title, price } = req.body;
  const ticket = await createTicket({
    title,
    price,
    userId: req.user!.id,
  });

  res.status(201).json({ data: ticket });
});

router.put("/:id", ...basicValidation, async (req, res) => {
  const { title, price } = req.body;
  const oldData = await getTicketById(req.params.id);

  if (oldData?.userId !== req.user!.id) {
    throw new AuthErrors();
  }

  const ticket = await updateTicket(req.params.id, {
    title,
    price,
    userId: req.user!.id,
  });

  res.status(200).json({ data: ticket });
});

export { router as createTicketRouter };
