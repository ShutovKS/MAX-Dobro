import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Начало конфигурации Swagger ---
  const config = new DocumentBuilder()
    .setTitle('MAX Добро API')
    .setDescription('API для мини-приложения социальной направленности "MAX Добро"')
    .setVersion('1.0')
    .addBearerAuth() // Добавляем поддержку авторизации по JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // --- Конец конфигурации Swagger ---

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();