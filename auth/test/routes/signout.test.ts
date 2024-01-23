import request from "supertest";
import { app } from "../../src/app";

const user = {
  email: "email@email.com",
  password: "password",
  passwordConfirmation: "password",
};

describe("Sign out route", () => {
  it("Successfully signing out", async () => {
    await request(app).post("/api/users/signup").send(user);

    await request(app)
      .post("/api/users/signout")
      .send({})
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.get("Set-Cookie")).toBeDefined();
      });
  });
});
