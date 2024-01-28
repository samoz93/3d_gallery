import { BaseSubject, EventsType, to } from "@samoznew/common";
import { NatsConnection, connect } from "nats";
import { TicketCreatedSubject, TicketUpdatedSubject } from "./events";

export class NatsWrapper {
  private _subjects: Partial<Record<EventsType, BaseSubject<EventsType, any>>> =
    {};

  private static _instance: NatsWrapper;
  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new NatsWrapper();
    }

    return this._instance;
  }

  async connect() {
    const [err, nc] = await to(
      connect({
        servers: ["http://nat-s"],
        timeout: 2000,
        reconnect: true,
        maxReconnectAttempts: 10,
      })
    );

    if (err) {
      throw err;
    }

    await this._initSubjects(nc);
    return this;
  }

  private async _initSubjects(nc: NatsConnection) {
    this._subjects[EventsType.TICKET_CREATED] = new TicketCreatedSubject(nc);
    this._subjects[EventsType.TICKET_UPDATED] = new TicketUpdatedSubject(nc);

    for await (const subject of Object.values(this._subjects)) {
      await subject.init();
    }
  }

  getSubject<D>(type: EventsType) {
    return this._subjects[type] as BaseSubject<EventsType, D>;
  }
}
