import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IProject } from './projects.interface';

export interface IUser {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  projects: IProject[];
  token?: string;
}

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
