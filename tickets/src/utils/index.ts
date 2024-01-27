import { PasswordService } from "@samoznew/common";
import { CONFIG } from "../config";

export const passwordManager = new PasswordService(CONFIG.JWT_KEY);

console.log(CONFIG.JWT_KEY);
