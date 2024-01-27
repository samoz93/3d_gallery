import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { passwordManager } from "../src/utils";

declare global {
  function signin(): string[];
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

global.signin = (): string[] => {
  const email = "test@test.com";
  const jwt = passwordManager.generateJWT({ email, id: "123" });
  const cookie = `session=${Buffer.from(JSON.stringify({ jwt })).toString(
    "base64"
  )};`;
  return [cookie];
};
