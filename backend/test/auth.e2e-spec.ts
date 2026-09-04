// FILE: backend/test/auth.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for unauthenticated and invalid-token rejection.
//   SCOPE: Protected /profile/me 401 scenarios
//   DEPENDS: M-AUTH, M-BACKEND-APP
//   LINKS: V-M-AUTH
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   beforeAll - boot Nest app with ValidationPipe
//   GET /profile/me without token - 401
//   GET /profile/me with invalid token - 401
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

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
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('should return 401 Unauthorized for a protected route without a token', () => {
    return request(app.getHttpServer()).get('/profile/me').expect(401);
  });

  it('should return 401 Unauthorized for a protected route with an invalid token', () => {
    return request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
  // END_BLOCK_SCENARIOS
});
