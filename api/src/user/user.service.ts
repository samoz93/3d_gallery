import { IUser } from '@common/index';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthErrors, DbErrors, _ } from '@samoz/utils';
import to from 'await-to-js';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  userExists = async (email: string) => {
    const [err, data] = await to(this.UserModel.findOne({ email }).exec());
    if (err) {
      throw new DbErrors('read', err);
    }
    return !!data;
  };

  async createUser(user: IUser): Promise<Partial<IUser>> {
    const exists = await this.userExists(user.email);

    if (exists) {
      throw new AuthErrors('alreadyExist');
    }

    const [err, data] = await to(new this.UserModel(user).save());
    if (err) {
      throw new DbErrors('save', err);
    }

    return _.omit(data.toObject<IUser>(), ['password']);
  }

  async getUserByEmail(
    email: string,
    includePassword = false,
  ): Promise<IUser | null> {
    const [err, data] = await to(this.UserModel.findOne({ email }).exec());
    if (err) {
      throw new DbErrors('read', err);
    }

    return includePassword
      ? data?.toObject<IUser>()
      : _.omit(data?.toObject<IUser>(), ['password']);
  }
}
