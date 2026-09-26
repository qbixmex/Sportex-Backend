import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', { exclude: ['/', 'health'] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());

  /* ======================== SWAGGER ======================== */
  const config = new DocumentBuilder()
    .setTitle('Sportex RESTFul API')
    .setDescription('Sports management platform')
    .setVersion('1')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'token',
    //     description: 'Introduce tu token JWT',
    //     in: 'header',
    //   },
    //   'token',
    // )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  });
  /* ========================================================= */

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
