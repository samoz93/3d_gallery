import { BaseSubject, EventsType } from "@samoznew/common";
import { ITicket } from "../models/tickets.model";

export class TicketCreatedSubject extends BaseSubject<EventsType, ITicket> {
  subject = EventsType.TICKET_CREATED;
  streamName: string = "ticketStream";
}

export class TicketUpdatedSubject extends BaseSubject<EventsType, ITicket> {
  subject = EventsType.TICKET_CREATED;
  streamName: string = "ticketStream";
}
