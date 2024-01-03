import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '@samoz/schemas';
import { UserService } from '@samoz/user/user.service';
import { AuthErrors, DbErrors } from '@samoz/utils';
import { IUser } from '@types';
import to from 'await-to-js';
import * as simplecrypt from 'simplecrypt';
import { _ } from 'src/utils';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private sc = simplecrypt({
    salt: process.env.SALT_ROUNDS || 'SAMOZ@TECH',
  });

  async hashPassword(password: string): Promise<string> {
    return this.sc.encrypt(password);
  }

  async register(user: IUser) {
    user.password = await this.hashPassword(user.password);
    const [err, userPayload] = await to(this.userService.createUser(user));
    if (err) {
      throw err;
    }
    userPayload.token = this.getJwt(userPayload);
    return userPayload;
  }

  async login({ email, password }): Promise<Partial<IUser>> {
    const hashedPassword = await this.hashPassword(password);
    const [err, data] = await to(
      UserModel.findOne({ email, password: hashedPassword }).exec(),
    );

    if (err) {
      throw new DbErrors('read', err);
    }

    if (!data) {
      throw new AuthErrors('loginError', new Error('Invalid Credentials'));
    }

    const userPayload = _.omit(data.toObject<IUser>(), ['password']);
    userPayload.token = this.getJwt(data);
    return userPayload;
  }

  private getJwt = (user: Partial<IUser>) => {
    return this.jwtService.sign({
      email: user.email,
      _id: user._id,
      name: user.userName,
    });
  };
}
