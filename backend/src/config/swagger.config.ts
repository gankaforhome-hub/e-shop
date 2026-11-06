// swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Admin Panel')
  .setDescription('API Description. This is backend for admin panel.')
  .setVersion('1.0.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })
  .setContact(
    'Maksym Holovachuk',
    'https://www.linkedin.com/in/maksym-holovachuk-a81888125/',
    'mgolovachuk@gmail.com',
  )
  // .addTag('api')
  .build();

export const setupSwagger = (app: INestApplication<any>) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
};
