import { BaseSubject, EventsType, to } from "@samoznew/common";
import { NatsConnection, connect } from "nats";

export class NatsWrapper {
  private _subjects: Partial<Record<EventsType, BaseSubject<EventsType, any>>> =
    {};

  private _nc: NatsConnection | undefined;
  private static _instance: NatsWrapper;
  constructor() {}

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

    // await this._initSubjects(nc);
    this._nc = nc;
    return nc;
  }

  private async _initSubjects(nc: NatsConnection) {
    // this._subjects[EventsType.TICKET_CREATED] = new TicketCreatedSubject(nc);
    // this._subjects[EventsType.TICKET_UPDATED] = new TicketUpdatedSubject(nc);

    for await (const subject of Object.values(this._subjects)) {
      await subject.init();
    }
  }

  getSubject<D>(type: EventsType): BaseSubject<EventsType, D> {
    return this._subjects[type] as BaseSubject<EventsType, D>;
  }

  async close() {
    await this._nc?.close();
    this._subjects = {};
  }
}
