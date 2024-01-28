import { Msg, SubOpts } from "nats";

export type INatsEvents = {
  [key: string]: SubOpts<Msg>["callback"];
};
