import { EventsType } from "@samoznew/common";
import { CONFIG } from "../config";
import { ITicket } from "../models/tickets.model";
import { PublisherBase } from "./publisher.base";
import { BaseSubject } from "./subject.base";

export class TicketCreateSubject extends BaseSubject<EventsType, ITicket> {
  subject = EventsType.TICKET_CREATED;
  consumerName: string = CONFIG.natsClient;
  streamName: string = "ticketStream";
}

export class TicketUpdateSubject extends BaseSubject<EventsType, ITicket> {
  subject = EventsType.TICKET_UPDATED;
  consumerName: string = CONFIG.natsClient;
  streamName: string = "ticketStream";
}

export class TicketPublisher extends PublisherBase<EventsType, ITicket> {
  subjects = [EventsType.TICKET_CREATED, EventsType.TICKET_UPDATED];
  streamName: string = "ticketStream";
}
