import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('General Endpoints (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/events', () => {
    it('GET /events/:id with non-numeric id should return 400', () => {
      return request(app.getHttpServer()).get('/events/abc').expect(400);
    });

    it('GET /events/:id with non-existent id should return 404', () => {
      return request(app.getHttpServer()).get('/events/999999').expect(404);
    });
  });

  describe('/courses', () => {
    it('GET /courses/:id with non-existent id should return 404', () => {
      return request(app.getHttpServer()).get('/courses/999999').expect(404);
    });
  });
});