import { SamozRequest } from '@common/index';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { config } from '@samoz/config/constant';
import { ROLES_KEY, UserRole } from '@samoz/user/user.schema';
import { AuthErrors } from '@samoz/utils';
import { IS_PUBLIC_KEY } from '@samoz/utils/auth.roles';
import to from 'await-to-js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return isPublic;

    // handle token
    const request = ctx.getRequest<SamozRequest>();
    const token = this.getToken(request.headers);
    if (!token) {
      throw new AuthErrors('unauthorized', new Error('Unauthorized'));
    }

    const [err, user] = await to(
      this.jwt.verifyAsync(token, { secret: config.auth.jwtSecret }),
    );

    if (err) {
      throw new AuthErrors('unauthorized', err);
    }

    if (!user) {
      throw new AuthErrors('unauthorized');
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new AuthErrors('unauthorized');
    }

    request.user = user;
    return true;
  }

  getToken = (headers: any) => {
    const [type, token] = headers.authorization?.split(' ');
    return type === 'Bearer' ? token : null;
  };
}
