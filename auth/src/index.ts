import to from "await-to-js";
import mongoose from "mongoose";
import { app } from "./app";
import { CONFIG } from "./config";

const init = async () => {
  const [err] = await to(mongoose.connect(CONFIG.MONGO_URI));
  if (err) {
    return;
  }

  app.listen(3010, () => {
    console.log("Listening on port 3010");
  });
};

init();
