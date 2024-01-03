// import { IProject } from '@types';
import { IUser } from '@types';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: String,
  // projects: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'projects',
  //   },
  // ],
});

export const UserModel = mongoose.model<IUser>('users', Schema);
