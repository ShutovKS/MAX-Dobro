// FILE: backend/test/friends.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for listing a user's friends.
//   SCOPE: GET /friends with friends and with an empty list
//   DEPENDS: M-FRIENDS, M-AUTH
//   LINKS: V-M-FRIENDS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   beforeAll - boot Nest app with AuthGuard override
//   GET /friends - returns related users
//   GET /friends empty - returns []
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

describe('Friends (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  let friendUser: User;
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
      data: { email: 'main@test.com', supabaseUserId: 'supa-main' },
    });
    friendUser = await prisma.user.create({
      data: {
        email: 'friend@test.com',
        supabaseUserId: 'supa-friend',
        firstName: 'Friend',
        lastName: 'User',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('GET /friends - should return a list of friends', async () => {
    await prisma.friendship.create({
      data: { userId: mockUser.id, friendId: friendUser.id },
    });

    const { body } = await request(app.getHttpServer())
      .get('/friends')
      .set('Authorization', authToken)
      .expect(200);

    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(friendUser.id);
    expect(body[0].name).toBe('Friend User');
  });

  it('GET /friends - should return an empty list if user has no friends', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/friends')
      .set('Authorization', authToken)
      .expect(200);

    expect(body).toEqual([]);
  });
  // END_BLOCK_SCENARIOS
});
