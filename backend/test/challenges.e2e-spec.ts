// FILE: backend/test/challenges.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for weekly challenge payload and empty contract.
//   SCOPE: GET /challenges/weekly with and without an active challenge
//   DEPENDS: M-CHALLENGES, M-AUTH
//   LINKS: V-M-CHALLENGES
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   beforeAll - boot Nest app with AuthGuard override
//   GET /challenges/weekly empty - {}
//   GET /challenges/weekly - title, progress, target, isCompleted
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { clearDatabase } from './test-utils';

describe('Challenges (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

  // START_BLOCK_SETUP_APP
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    mockUser = await prisma.user.create({
      data: {
        email: 'challenges@test.com',
        supabaseUserId: 'supa-challenges',
        firstName: 'Challenge',
        lastName: 'Tester',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('GET /challenges/weekly - should return an empty object if no active weekly challenge', async () => {
    await request(app.getHttpServer())
      .get('/challenges/weekly')
      .set('Authorization', authToken)
      .expect(200)
      .then((response) => {
        // Возвращаем ожидание пустого объекта, так как NestJS сериализует null как {}
        expect(response.body).toEqual({});
      });
  });

  it('GET /challenges/weekly - should return weekly challenge status for a user', async () => {
    const challenge = await prisma.challenge.create({
      data: {
        title: 'Eco Week',
        description: 'Participate in 3 eco events',
        reward: '+100 Karma',
        criteriaType: 'EVENTS',
        criteriaValue: 3,
        period: 'WEEKLY',
      },
    });
    await prisma.userChallenge.create({
      data: {
        userId: mockUser.id,
        challengeId: challenge.id,
        progress: 1,
      },
    });

    const { body } = await request(app.getHttpServer())
      .get('/challenges/weekly')
      .set('Authorization', authToken)
      .expect(200);

    expect(body.title).toBe('Eco Week');
    expect(body.progress).toBe(1);
    expect(body.target).toBe(3);
    expect(body.isCompleted).toBe(false);
  });
  // END_BLOCK_SCENARIOS
});
