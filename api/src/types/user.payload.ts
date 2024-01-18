import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Request } from 'express';
import { IProject } from './projects.interface';
import { IUser } from './user.types';

export class IRegistrationPayload implements IUser {
  @IsString()
  userName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsOptional()
  projects: IProject[];
}

export class ILoginPayload implements Partial<IUser> {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export type SamozRequest = Request & { user?: IUser };
