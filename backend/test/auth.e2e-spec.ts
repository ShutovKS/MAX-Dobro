import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

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

  it('should return 401 Unauthorized for a protected route without a token', () => {
    return request(app.getHttpServer()).get('/profile/me').expect(401);
  });

  it('should return 401 Unauthorized for a protected route with an invalid token', () => {
    return request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});