import { Body, Controller, Post } from '@nestjs/common';
import { SamozValidationPipe } from '@samoz/pipes/validation.pipe';
import { Public } from '@samoz/utils/auth.roles';
import { ILoginPayload, IRegistrationPayload } from '../../types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  @Public()
  register(@Body(new SamozValidationPipe()) body: IRegistrationPayload) {
    return this.service.register(body);
  }

  @Post('login')
  @Public()
  login(@Body(new SamozValidationPipe()) body: ILoginPayload) {
    return this.service.login(body);
  }
}
