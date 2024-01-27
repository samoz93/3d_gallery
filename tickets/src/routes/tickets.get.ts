import { Router } from "express";
import { getTicketById, getTickets } from "../services";
const router = Router();

router.get("", async (req, res) => {
  const tickets = await getTickets();
  res.status(200).json({ data: tickets });
});

router.get("/:id", async (req, res) => {
  const ticket = await getTicketById(req.params.id);
  res.status(200).json({ data: ticket });
});

export { router as getTicketsRouter };
