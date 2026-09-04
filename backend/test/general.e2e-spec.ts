// FILE: backend/test/general.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for invalid-id 400/404 on public event and course routes.
//   SCOPE: Non-numeric and missing event/course identifiers
//   DEPENDS: M-BACKEND-APP, M-EVENTS, M-LEARNING
//   LINKS: V-M-BACKEND-BOOTSTRAP
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   beforeAll - boot Nest app with ValidationPipe
//   GET /events/:id non-numeric - 400
//   GET /events/:id missing - 404
//   GET /courses/:id missing - 404
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

  // START_BLOCK_SETUP_APP
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
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
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
  // END_BLOCK_SCENARIOS
});
