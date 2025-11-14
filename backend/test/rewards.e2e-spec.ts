import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Rewards (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 1,
    supabaseUserId: 'test-supabase-id-rewards',
    email: 'rewards-test@example.com',
    name: 'Test User',
    totalHours: 0,
    karmaPoints: 150,
    avatarUrl: null,
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
    await prisma.storyLike.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.story.deleteMany();
    await prisma.userReward.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.userCertificate.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.userOrganizationSubscription.deleteMany();
    await prisma.karmaLog.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.userReward.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    if (app) {
      await app.close();
    }
  });

  it('/rewards (GET) - should return a list of rewards', async () => {
    await prisma.reward.create({
      data: { title: 'Test Reward', description: 'desc', cost: 100 },
    });
    return request(app.getHttpServer())
      .get('/rewards')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Test Reward');
      });
  });

  it('/rewards/:id/purchase (POST) - should purchase a reward if user has enough karma', async () => {
    const reward = await prisma.reward.create({
      data: { title: 'Purchasable Reward', description: 'desc', cost: 100 },
    });
    await request(app.getHttpServer())
      .post(`/rewards/${reward.id}/purchase`)
      .expect(201);
    const user = await prisma.user.findUnique({ where: { id: mockUser.id } });
    expect(user?.karmaPoints).toBe(50);
  });

  it('/rewards/:id/purchase (POST) - should return 403 if user has not enough karma', async () => {
    const reward = await prisma.reward.create({
      data: {
        title: 'Expensive Reward',
        description: 'desc',
        cost: 200,
      },
    });
    await request(app.getHttpServer())
      .post(`/rewards/${reward.id}/purchase`)
      .expect(403);
  });
});