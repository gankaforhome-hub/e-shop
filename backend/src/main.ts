import { setupSwagger } from '@config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
// import { logger } from 'src/middlewares';
const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //COMMENT client IP behind a reverse proxy, rate limiting relies on it
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 0));

  //COMMENT security headers
  app.use(helmet());

  //COMMENTS Validation pipe for income data
  //whitelist: true - not adding any fields does not match DTO
  //forbidNonWhitelisted: true - such fields are rejected instead of dropped
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  //COMMENTS Custom Prisma client exception filter
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  //COMMENTS Starts listening for shutdown hooks
  app.enableShutdownHooks();

  //COMMENT set cors request
  // app.enableCors();
  //COMMENT any origin during development; production stays closed until the allow-list is added
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: true, credentials: true });
  }

  //COMMENT set cookies
  app.use(cookieParser());

  //COMMENT set global prefix
  app.setGlobalPrefix('api');

  //COMMENT config swagger
  setupSwagger(app);

  //COMMENT logger
  // app.use(logger);

  //COMMENT listen server on port
  const port = process.env.SERVER_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  const url = await app.getUrl();

  return { url };
}

//COMMENT run server
bootstrap()
  .then(({ url }) => {
    logger.log(`Application is running on (Backend): ${url}`);
    logger.log(`📝 Swagger documentation is available on: ${url}/docs`);
  })
  .catch(err => {
    logger.error('❌ Critical error during application bootstrap:', err);
    process.exit(1);
  });
