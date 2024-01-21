export const CONFIG: Record<string, string> = {
  JWT_KEY: process.env.JWT_KEY || "SUperSecretSecret",
  MONGO_URI: process.env.MONGO_URI || "mongodb://auth-mongo-s:27017/auth",
};
