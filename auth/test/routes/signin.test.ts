import request from "supertest";
import { app } from "../../src/app";

const user = {
  email: "email@email.com",
  password: "password",
  passwordConfirmation: "password",
};

describe("Sign in route", () => {
  it("Successfully sign in a user", async () => {
    await request(app).post("/api/users/signup").send(user);

    request(app)
      .post("/api/users/signin")
      .send(user)
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("data.id");
        expect(res.body.data.email).toEqual(user.email);
        expect(res.body).not.toHaveProperty("data.password");
        expect(res.get("Set-Cookie")).toBeDefined();
      });
  });

  it("fail when sign in for not found user", async () => {
    request(app)
      .post("/api/users/signin")
      .send(user)
      .expect((res) => {
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("error");
      });
  });
});
