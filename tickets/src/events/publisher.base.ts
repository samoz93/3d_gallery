import {
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  StorageType,
} from "nats";

export abstract class PublisherBase<T extends string, D> {
  abstract subjects: T[];
  protected abstract streamName: string;
  private manager: JetStreamManager | undefined;
  private js: JetStreamClient | undefined;

  constructor(private stan: NatsConnection) {}

  private initEd = false;

  async init() {
    this.manager = await this.stan.jetstreamManager();
    this.js = this.stan.jetstream();
    try {
      this.manager.streams.add({
        name: this.streamName,
        subjects: this.subjects,
        storage: StorageType.Memory,
      });
    } catch (error) {
      console.info("Stream Already exists");
    }

    this.initEd = true;
  }

  async send(subject: T, data: D) {
    if (!this.initEd)
      throw new Error(
        "Call service.init and wait before setting up a listener"
      );

    const newData = typeof data === "string" ? data : JSON.stringify(data);
    return await this.js?.publish(subject, newData);
  }

  close() {
    this.stan.close();
  }
}
