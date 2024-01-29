export const CONFIG = {
  JWT_KEY: process.env.JWT_KEY || "SUperSecretSecret",
  MONGO_URI: process.env.MONGO_URI || "mongodb://auth-mongo-s:27017/auth",
  PORT: process.env.PORT || 2012,
  isDev: process.env.NODE_ENV !== "production",
  natsClient: process.env.NATS_CLIENT_ID || "tickets",
};
