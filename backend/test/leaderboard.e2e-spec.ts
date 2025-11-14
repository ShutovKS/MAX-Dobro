import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { clearDatabase } from './test-utils';

describe('Leaderboard (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

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
        email: 'leader-test@example.com',
        supabaseUserId: 'supa-leaderboard',
        firstName: 'Current',
        lastName: 'User',
        karmaPoints: 60,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('/leaderboard?period=allTime (GET) should return all-time leaders', async () => {
    await prisma.user.create({
      data: {
        email: 'alltime@test.com',
        supabaseUserId: 'supa-alltime',
        firstName: 'AllTime',
        lastName: 'Winner',
        karmaPoints: 1000,
      },
    });

    const { body } = await request(app.getHttpServer())
      .get('/leaderboard?period=allTime')
      .set('Authorization', authToken)
      .expect(200);

    expect(body.topUsers[0].name).toBe('AllTime Winner');
    expect(body.topUsers[0].karma).toBe(1000);
    expect(body.currentUser.rank).toBe(2);
  });
});