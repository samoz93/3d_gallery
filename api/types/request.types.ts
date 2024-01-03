import { Request } from 'express';
import { IUser } from './user.types';

export type SamozRequest = Request & { user?: IUser };
