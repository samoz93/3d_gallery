import request from "supertest";
import { app } from "../../src/app";

describe("Current user route", () => {
  it("Successfully getting the user info after a sign up", async () => {
    const result = await global.signin();
    await request(app)
      .get("/api/users/me")
      .set("Cookie", result)
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("data.id");
      });
  });

  it("return null when not authenticated", async () => {
    await request(app)
      .get("/api/users/me")
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toBeFalsy();
      });
  });
});
