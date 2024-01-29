import { BaseSubject, EventsType } from "@samoznew/common";
import { NatsConnection } from "nats";

export class NatsWrapper {
  private _subjects: Partial<Record<EventsType, BaseSubject<EventsType, any>>> =
    {};
  _mock = "SAMEH";

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
    return this;
  }

  private async _initSubjects(nc: NatsConnection) {}

  getSubject<D>(type: EventsType) {
    return jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({}),
    });
  }

  async close() {}
}
