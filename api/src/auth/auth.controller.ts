import { ILoginPayload, IRegistrationPayload } from '@common/index';
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@samoz/utils/auth.roles';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() body: IRegistrationPayload) {
    return this.service.register(body);
  }

  @Post('login')
  @Public()
  login(@Body() body: ILoginPayload) {
    return this.service.login(body);
  }
}
