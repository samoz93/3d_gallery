import { UserRole } from '@samoz/user/user.schema';
import { IProject } from './projects.interface';

export interface IUser {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  projects: IProject[];
  token?: string;
  role?: UserRole;
}
