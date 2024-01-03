import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from '@samoz/controllers/app.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { SamozExceptionFilter } from './filters/exception-filter.filter';
import { ProjectsModule } from './projects/projects.module';
import { DbService } from './services/db.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ProjectsModule, UserModule],
  controllers: [AppController],
  providers: [
    DbService,
    {
      provide: APP_FILTER,
      useClass: SamozExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
