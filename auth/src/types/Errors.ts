import { Result, ValidationError } from "express-validator";

export abstract class MyError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): { message: string; reasons?: any[] };
}

export class MyValidationError extends MyError {
  statusCode = 400;

  constructor(private errors: Result<ValidationError>) {
    super("Validation Errors");
  }

  serializeErrors() {
    return {
      message: this.message,
      reasons: this.errors.array().map((err) => {
        return {
          message: err.msg,
          field: err.type === "field" ? err["path"] : err.type,
        };
      }),
    };
  }
}

export class NotFoundError extends MyError {
  statusCode = 404;

  constructor() {
    super("Route not found");
  }

  serializeErrors() {
    return { message: "Not Found" };
  }
}

export class DBError extends MyError {
  statusCode = 500;

  constructor(private err: Error) {
    super("Database Error");
  }

  serializeErrors() {
    return { message: "Something bad happened!!", error: this.err };
  }
}

export class UserExists extends MyError {
  statusCode = 400;

  constructor(id: string) {
    super("User already exists");
  }

  serializeErrors() {
    return { message: "User already exists", fields: ["email"] };
  }
}
