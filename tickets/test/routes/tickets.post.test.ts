import request from "supertest";
import { app } from "../../src/app";
describe("Signup route", () => {
  it("we are able to reach api/tickets", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toEqual(404);
  });

  it("Only verified users can reach this endpoint", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).toEqual(401);
  });

  it("Can reach it if the user is authenticated", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({});
    expect(res.status).not.toEqual(401);
  });

  it("Return an error if an invalid title is sent", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        price: 10,
      })
      .expect(400);
  });

  it("Return an error if an invalid price is sent", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "",
        price: "asda",
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "",
        price: -100,
      })
      .expect(400);
  });

  it("Return an object after sending correct information", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "asdadsas",
        price: 100,
      });

    expect(res.status).toEqual(201);
    expect(res.body?.data).toHaveProperty("title");
    expect(res.body?.data).toHaveProperty("price");
    expect(res.body.data.title).toEqual("asdadsas");
    expect(res.body.data.price).toEqual(100);
    expect(res.body.data).toHaveProperty("id");
  });

  it("Been able to update a ticket", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "asdadsas",
        price: 100,
      });

    expect(res.status).toEqual(201);

    const updatedTicket = await request(app)
      .put(`/api/tickets/${res.body.data.id}`)
      .set("Cookie", signin())
      .send({
        title: "newTitle",
        price: 200,
      });

    console.log("updatedTicket", updatedTicket.body.data);

    expect(updatedTicket.body.data.title).toEqual("newTitle");
    expect(updatedTicket.body.data.price).toEqual(200);
    expect(updatedTicket.body.data.id).toEqual(res.body.data.id);
  });

  it("Can't update a value if not the owner", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({
        title: "asdadsas",
        price: 100,
      });

    expect(res.status).toEqual(201);

    const data = await request(app)
      .put(`/api/tickets/${res.body.data.id}`)
      .set("Cookie", signin(1))
      .send({
        title: "newTitle",
        price: 200,
      });

    expect(data.body.error).toBeDefined();
    expect(data.status).toEqual(401);
  });
});
