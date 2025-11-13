import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Profile (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 1,
    supabaseUserId: 'test-supabase-id-profile',
    email: 'profile-test@example.com',
    name: 'Test User',
    totalHours: 0,
    karmaPoints: 0,
  };

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

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
    await prisma.userReward.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.userOrganizationSubscription.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userCertificate.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) {
      await app.close();
    }
  });

  it('/profile/me (GET) - should return current user profile', async () => {
    return request(app.getHttpServer())
      .get('/profile/me')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(mockUser.id);
        expect(res.body.email).toBe(mockUser.email);
        expect(res.body).toHaveProperty('levelName');
      });
  });

  it('/profile/me/rewards (GET) - should return users purchased rewards', async () => {
    const reward = await prisma.reward.create({
      data: { title: 'Test Reward', description: 'desc', cost: 100 },
    });

    await prisma.userReward.create({
      data: {
        userId: mockUser.id,
        rewardId: reward.id,
      },
    });

    return request(app.getHttpServer())
      .get('/profile/me/rewards')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].rewardId).toBe(reward.id);
        expect(res.body[0].reward.title).toBe(reward.title);
      });
  });
});