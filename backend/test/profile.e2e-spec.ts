// FILE: backend/test/profile.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for the authenticated current-user profile.
//   SCOPE: GET /profile/me with AuthGuard override
//   DEPENDS: M-AUTH, M-USERS
//   LINKS: V-M-AUTH
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockAuthGuard - injects mockUser onto the request
//   beforeAll - boot Nest app with AuthGuard override
//   GET /profile/me - returns current user profile
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

describe('Profile (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

  // START_CONTRACT: mockAuthGuard
  //   PURPOSE: Inject mockUser as request.user for protected routes
  //   INPUTS: { context: ExecutionContext }
  //   OUTPUTS: { true }
  //   SIDE_EFFECTS: mutates request.user
  //   LINKS: V-M-AUTH
  // END_CONTRACT: mockAuthGuard
  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  // START_BLOCK_SETUP_APP
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    mockUser = await prisma.user.create({
      data: {
        email: 'profile-test@example.com',
        supabaseUserId: 'test-supabase-id-profile',
        firstName: 'Test',
        lastName: 'User',
        karmaPoints: 125,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) {
      await app.close();
    }
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('/profile/me (GET) - should return current user profile', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', authToken)
      .expect(200);

    expect(body.email).toBe(mockUser.email);
    expect(body.name).toBe('Test User');
    expect(body.level).toBe('Активист');
  });
  // END_BLOCK_SCENARIOS
});
