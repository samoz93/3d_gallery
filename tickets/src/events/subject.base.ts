import {
  AckPolicy,
  Consumer,
  ConsumerConfig,
  DeliverPolicy,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  ReplayPolicy,
} from "nats";

export abstract class BaseSubject<T extends string, D> {
  abstract subject: T;
  abstract consumerName: string;
  protected abstract streamName: string;
  private manager: JetStreamManager | undefined;
  constructor(private stan: NatsConnection) {}
  private js: JetStreamClient | undefined;

  private initEd = false;

  async init() {
    this.manager = await this.stan.jetstreamManager();
    this.js = this.stan.jetstream();
    this.initEd = true;
    await this.getConsumer();
  }

  private consumers: { [key: string]: Consumer } = {};

  private async getConsumer(): Promise<Consumer> {
    const mappingName = this.subject.replace(/[^a-zA-Z]/g, "");

    if (this.consumers[mappingName]) return this.consumers[mappingName];

    const consumerConfig: ConsumerConfig = {
      name: mappingName,
      durable_name: mappingName,
      ack_policy: AckPolicy.Explicit,
      ack_wait: 5 * 1000,
      replay_policy: ReplayPolicy.Original,
      deliver_policy: DeliverPolicy.LastPerSubject,
      max_ack_pending: 1 * 1000,
      filter_subject: this.subject,
    };

    await this.manager!.consumers.add(this.streamName, consumerConfig);
    const cc = await this.js!.consumers.get(this.streamName, mappingName);

    this.consumers[mappingName] = cc;
    return cc;
  }

  async startListening(onMessage: (data: D) => Promise<boolean> | boolean) {
    if (!this.initEd) {
      throw new Error(
        "Call service.init and wait before setting up a listener"
      );
    }
    const consumer = await this.getConsumer();
    const consumeData = await consumer.consume({
      max_messages: 3,
      async callback(msg) {
        try {
          let msgData;
          try {
            msgData = msg.json();
          } catch (error) {
            msgData = msg.data.toString();
          }
          const result = await onMessage(msgData as D);
          if (result) msg.ack();
          else msg.nak();
        } catch (error) {
          console.error(`Error handling the message ${msg.seq} data`, error);
          msg.nak();
        }
      },
    });

    return () => {
      consumeData?.close();
    };
  }

  close() {
    this.stan.close();
  }
}
