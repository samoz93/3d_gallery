import { IUser } from '@common/index';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '@samoz/config/constant';
import { UserRole } from '@samoz/user/user.schema';
import { UserService } from '@samoz/user/user.service';
import { AuthErrors, DbErrors } from '@samoz/utils';
import to from 'await-to-js';
import * as bcrypt from 'bcryptjs';
import { _ } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, config.auth.salt);
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
    const [err, data] = await to(this.userService.getUserByEmail(email, true));

    if (err) {
      throw new DbErrors('read', err);
    }

    const compare = await bcrypt.compare(password, data?.password);

    if (!compare) {
      throw new AuthErrors('loginError', new Error('Invalid Credentials'));
    }

    const userPayload = _.omit(data, ['password']);
    userPayload.token = this.getJwt(data);
    return userPayload;
  }

  private getJwt = (user: Partial<IUser>) => {
    return this.jwtService.sign({
      email: user.email,
      _id: user._id,
      name: user.userName,
      role: user.role || UserRole.USER,
    });
  };
}
