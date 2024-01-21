import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buff.toString("hex")}.${salt}`;
  }
  static async comparePassword(
    storedPassword: string,
    password: string
  ): Promise<boolean> {
    const [hashed, salt] = storedPassword.split(".");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return buff.toString("hex") === hashed;
  }
}
