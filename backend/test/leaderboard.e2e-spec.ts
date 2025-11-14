import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Leaderboard (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 104,
    supabaseUserId: 'supa-leaderboard',
    email: 'leader-test@example.com',
    name: 'Current User',
    totalHours: 0,
    karmaPoints: 60,
    avatarUrl: 'https://i.pravatar.cc/48?img=1',
  };

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    await prisma.storyLike.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.story.deleteMany();
    await prisma.karmaLog.deleteMany();
    await prisma.user.deleteMany();

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    await prisma.user.createMany({
      data: [
        {
          id: 101,
          email: 'user1@test.com',
          supabaseUserId: 'supa-1',
          name: 'Weekly Winner',
          karmaPoints: 100,
          avatarUrl: null,
        },
        {
          id: 102,
          email: 'user2@test.com',
          supabaseUserId: 'supa-2',
          name: 'Monthly Winner',
          karmaPoints: 500,
          avatarUrl: null,
        },
        {
          id: 103,
          email: 'user3@test.com',
          supabaseUserId: 'supa-3',
          name: 'AllTime Winner',
          karmaPoints: 1000,
          avatarUrl: null,
        },
        mockUser as User,
      ],
    });

    const now = new Date();
    const threeDaysAgo = new Date(new Date().setDate(now.getDate() - 3));
    const tenDaysAgo = new Date(new Date().setDate(now.getDate() - 10));
    const fortyDaysAgo = new Date(new Date().setDate(now.getDate() - 40));

    await prisma.karmaLog.createMany({
      data: [
        { userId: 101, points: 100, createdAt: threeDaysAgo },
        { userId: 102, points: 400, createdAt: tenDaysAgo },
        { userId: 103, points: 900, createdAt: fortyDaysAgo },
        { userId: 104, points: 60, createdAt: threeDaysAgo },
      ],
    });
  });

  afterAll(async () => {
    await prisma.karmaLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('/leaderboard?period=allTime (GET) should return all-time leaders', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/leaderboard?period=allTime')
      .expect(200);

    expect(body.topUsers[0].name).toBe('AllTime Winner');
    expect(body.topUsers[0].karmaPoints).toBe(1000);
    expect(body.currentUser.rank).toBe(4);
  });

  it('/leaderboard?period=month (GET) should return monthly leaders', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/leaderboard?period=month')
      .expect(200);

    expect(body.topUsers[0].name).toBe('Monthly Winner');
    expect(body.topUsers[0].karmaPoints).toBe(400);
    expect(body.topUsers[1].name).toBe('Weekly Winner');
    expect(body.currentUser.rank).toBe(3);
    expect(body.currentUser.karmaPoints).toBe(60);
  });

  it('/leaderboard?period=week (GET) should return weekly leaders', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/leaderboard?period=week')
      .expect(200);

    expect(body.topUsers).toHaveLength(2);
    expect(body.topUsers[0].name).toBe('Weekly Winner');
    expect(body.topUsers[0].karmaPoints).toBe(100);
    expect(body.topUsers[1].name).toBe('Current User');
    expect(body.currentUser.rank).toBe(2);
    expect(body.currentUser.karmaPoints).toBe(60);
  });
});