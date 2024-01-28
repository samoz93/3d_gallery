import to from "await-to-js";
import mongoose from "mongoose";
import { app } from "./app";
import { CONFIG } from "./config";

const init = async () => {
  const [err] = await to(mongoose.connect(CONFIG.MONGO_URI));
  if (err) {
    return;
  }

  app.listen(CONFIG.PORT, () => {
    console.log("Listening on port " + CONFIG.PORT);
  });
};

init();
