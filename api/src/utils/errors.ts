import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export abstract class SamozError<T = any> {
  constructor(
    public type: T,
    public error: Error,
  ) {}

  abstract get message(): string;
  abstract get httpErrorCode(): HttpStatus;

  get errorPayload(): Error | any {
    return this.error;
  }
}

type DbErrorTypes = 'connection' | 'save' | 'read' | 'not-found' | 'remove';
export class DbErrors extends SamozError<DbErrorTypes> {
  constructor(type: DbErrorTypes, error: Error) {
    super(type, error);
  }

  get message() {
    //TODO: handle differently later
    return this.error.message;
  }

  get httpErrorCode() {
    //TODO:
    return HttpStatus.FORBIDDEN;
  }
}

export class SamozValidationError extends SamozError<'validation'> {
  constructor(private errors: ValidationError[]) {
    super('validation', errors[0].value);
  }
  get message(): string {
    return this.errors.map((e) => e.toString()).join(', ');
  }

  override get errorPayload() {
    return this.errors;
  }

  get httpErrorCode(): HttpStatus {
    return HttpStatus.BAD_REQUEST;
  }
}

type AuthErrorTypes = 'loginError' | 'alreadyExist' | 'unauthorized';
export class AuthErrors extends SamozError<AuthErrorTypes> {
  constructor(type: AuthErrorTypes, error: Error) {
    super(type, error);
  }
  get message(): string {
    // TODO: handle differently later
    return 'Auth Error.';
  }
  get httpErrorCode(): HttpStatus {
    return HttpStatus.BAD_REQUEST;
  }
}
