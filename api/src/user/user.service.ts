import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '@samoz/schemas';
import { AuthErrors, DbErrors, _ } from '@samoz/utils';
import { IDoc, IUser } from '@types';
import to from 'await-to-js';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  userExists = async (email: string) => {
    const [err, data] = await to(UserModel.findOne({ email }).exec());
    if (err) {
      throw new DbErrors('read', err);
    }
    return !!data;
  };

  async createUser(user: IUser): Promise<Partial<IUser>> {
    const exists = await this.userExists(user.email);

    if (exists) {
      throw new AuthErrors('alreadyExist', new Error('User Already Exists'));
    }

    const [err, data] = await to<IDoc<IUser>>(new UserModel(user).save());
    if (err) {
      throw new DbErrors('save', err);
    }

    return _.omit(data.toObject<IUser>(), ['password']);
  }
}
