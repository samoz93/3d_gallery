import to from "await-to-js";
import * as nats from "nats";
import { TicketCreatedSubject } from "./events";

export const setupNats = async () => {
  const [err, nc] = await to(
    nats.connect({
      servers: ["http://nat-s"],
      timeout: 2000,
      reconnect: true,
      maxReconnectAttempts: 10,
      // debug: CONFIG.isDev,
    })
  );

  const ticketService = new TicketCreatedSubject(nc!);
  await ticketService.init();
  ticketService.startListening((data) => {
    console.log(data);
    return !!data;
  });
};
