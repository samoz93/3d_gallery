import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '@samoz/controllers/app.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { config } from './config/constant';
import { SamozExceptionFilter } from './filters/exception-filter.filter';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';

const dbConnection = `mongodb://${config.db.userName}:${config.db.password}@mongo:27017`;
@Module({
  imports: [
    MongooseModule.forRoot(dbConnection, {
      dbName: 'mainDB',
    }),
    AuthModule,
    ProjectsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
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
