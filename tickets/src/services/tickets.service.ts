import { DBError, to } from "@samoznew/common";
import { ITicket, TicketModel } from "../models/tickets.model";

export const createTicket = async (ticket: ITicket) => {
  try {
    return await TicketModel.create(ticket);
  } catch (error) {
    throw new DBError(error as Error);
  }
};

export const getTickets = async () => {
  const [err, data] = await to(TicketModel.find({}).exec());
  if (err) {
    throw new DBError(err as Error);
  }
  return data;
};

export const getTicketById = async (id: string) => {
  const [err, data] = await to(
    TicketModel.findOne({
      _id: id,
    }).exec()
  );

  if (err) {
    throw new DBError(err as Error);
  }
  return data;
};
