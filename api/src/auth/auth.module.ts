import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@samoz/config/constant';
import { UserModule } from '@samoz/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: config.auth.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
