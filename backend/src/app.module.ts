import { LoggerMiddleware } from '@common/middlewares';
import { throttlers, validateEnv } from '@config';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CollectionModule } from '@modules/collection/collection.module';
import { CookieModule } from '@modules/cookie/cookie.module';
import { MediaModule } from '@modules/media/media.module';
import { ServerModule } from '@modules/server/server.module';
import { UserModule } from '@modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot(throttlers),
    ServerModule,
    CookieModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    MediaModule,
    CollectionModule,
  ],
  providers: [
    Logger,
    //COMMENT first, so requests with guessed tokens count against the limit too
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
