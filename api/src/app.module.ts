import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '@samoz/controllers/app.controller';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      typePaths: ['./**/*.graphql'],
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: true,
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
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
