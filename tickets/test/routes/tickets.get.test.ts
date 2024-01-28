import request from "supertest";
import { app } from "../../src/app";
describe("Signup route", () => {
  const ticket = {
    title: "asdasd",
    price: 100,
  };

  it("We are able to get ticket information", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send(ticket);

    expect(res.status).toEqual(201);
    // User test id is 123
    expect(res.body.data.userId).toEqual("123");

    const allTickets = await request(app).get("/api/tickets").send({});
    expect(allTickets.status).toEqual(200);
    expect(allTickets.body.data.length).toEqual(1);

    const ticketById = await request(app)
      .get(`/api/tickets/${res.body.data.id}`)
      .send({});

    expect(ticketById.status).toEqual(200);
    expect(ticketById.body).toEqual(res.body);
  });
});
