import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProject } from '@types';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  _id?: string;
  @Prop()
  userName: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: IProject[];
  token?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
