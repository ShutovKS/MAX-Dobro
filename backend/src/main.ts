// FILE: backend/src/main.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: NestJS bootstrap that creates the API app, CORS, validation, Swagger, and listen port.
//   SCOPE: application factory, CORS, global ValidationPipe, OpenAPI docs, HTTP listen
//   DEPENDS: M-BACKEND-APP
//   LINKS: M-BACKEND-BOOTSTRAP, V-M-BACKEND-BOOTSTRAP, M-BACKEND-APP
//   ROLE: RUNTIME
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   bootstrap - create AppModule, apply CORS and pipes, mount Swagger, listen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// START_CONTRACT: bootstrap
//   PURPOSE: Start the Nest HTTP server with CORS, validation, and Swagger docs.
//   INPUTS: { none - reads process.env.PORT }
//   OUTPUTS: { Promise<void> - process stays alive on the listen port }
//   SIDE_EFFECTS: binds HTTP port; logs listen confirmation
//   LINKS: M-BACKEND-BOOTSTRAP, V-M-BACKEND-BOOTSTRAP, M-BACKEND-APP
// END_CONTRACT: bootstrap
async function bootstrap() {
  // START_BLOCK_CREATE_APP
  const app = await NestFactory.create(AppModule);
  // END_BLOCK_CREATE_APP

  // START_BLOCK_CORS_AND_PIPES
  app.enableCors({
    origin: [
      'https://dobroclub.online',
      'https://max-dobro.vercel.app',
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
      'https://pykfcxpfpdrtuxdnyjll.supabase.co',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // END_BLOCK_CORS_AND_PIPES

  // START_BLOCK_SWAGGER_AND_LISTEN
  const config = new DocumentBuilder()
    .setTitle('MAX Добро API')
    .setDescription('API для мини-приложения социальной направленности "MAX Добро"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`[MAX-DOBRO-API] --- Application is listening on port ${process.env.PORT ?? 3000} ---`);
  // END_BLOCK_SWAGGER_AND_LISTEN
}

bootstrap();
