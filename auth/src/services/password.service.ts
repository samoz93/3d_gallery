import { randomBytes, scrypt } from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { CONFIG } from "../config";
import { User, UserDocument } from "../models";

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

  static decodeJWT(token: string): User {
    const payload = jwt.verify(token, CONFIG.JWT_KEY) as User;
    return payload;
  }

  static generateJWT(user: UserDocument): string {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      CONFIG.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    return token;
  }
}
