import request from "supertest";
import { app } from "../../src/app";

describe("Signup route", () => {
  it("return a 201 on successful signup", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("data.id");
        expect(res.body).toHaveProperty("data.email");
        expect(res.body.data.email).toEqual("email@email.com");
      });
  });

  it("return a 400 on failed input", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "email@email.com",
        password: "password",
      })
      .expect(400);
  });

  it("return a 400 on failed input", async () => {
    await request(app).post("/api/users/signup").send({}).expect(400);
  });

  it("disallow duplicate emails", async () => {
    await request(app).post("/api/users/signup").send({
      email: "hi@hi.com",
      password: "password",
      passwordConfirmation: "password",
    });

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "hi@hi.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect((res) => {
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("error");
      });
  });

  it("Check out the cookieeee", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .then((res) => {
        expect(res.get("Set-Cookie")).toBeDefined();
      });
  });
});
