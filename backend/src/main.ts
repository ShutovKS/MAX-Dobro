import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[MAX-DOBRO-API] --- Starting bootstrap function ---');
  const app = await NestFactory.create(AppModule);

  console.log('[MAX-DOBRO-API] --- Enabling CORS ---');
  app.enableCors({
    origin: [
      '*',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  console.log('[MAX-DOBRO-API] --- CORS has been configured ---');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

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
}

bootstrap();