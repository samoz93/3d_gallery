import request from "supertest";
import { app } from "../../src/app";

describe("Sign in route", () => {
  it("Successfully sign in a user", async () => {
    const user = {
      email: "email@email.com",
      password: "password",
      passwordConfirmation: "password",
    };
    await request(app).post("/api/users/signup").send(user);

    request(app)
      .post("/api/users/signin")
      .send(user)
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("data.id");
        expect(res.body.data.email).toEqual(user.email);
        expect(res.body).not.toHaveProperty("data.password");
      });
  });

  it("fail when sign in for not found user", async () => {
    const user = {
      email: "email@email.com",
      password: "password",
      passwordConfirmation: "password",
    };

    request(app)
      .post("/api/users/signin")
      .send(user)
      .expect((res) => {
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("error");
      });
  });
});
