import { setupSwagger } from '@config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
// import { logger } from 'src/middlewares';
const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //COMMENTS Validation pipe for income data
  //whitelist: true - not adding any fields does not match DTO
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, stopAtFirstError: true }),
  );

  //COMMENTS Custom Prisma client exception filter
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  //COMMENTS Starts listening for shutdown hooks
  app.enableShutdownHooks();

  //COMMENT set cors request
  // app.enableCors();

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
