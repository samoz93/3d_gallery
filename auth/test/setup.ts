import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../src/app";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_KEY = "test";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password, passwordConfirmation: password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
