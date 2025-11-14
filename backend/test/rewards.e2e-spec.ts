import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { OptionalAuthGuard } from '../src/auth/guards/optional-auth.guard';
import { clearDatabase } from './test-utils';

describe('Rewards (e2e)', () => {
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
          return !!req.headers.authorization;
        },
      })
      .overrideGuard(OptionalAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          if (req.headers.authorization) {
            req.user = mockUser;
          }
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
        email: 'rewards-user@test.com',
        supabaseUserId: 'supa-rewards-user',
        karmaPoints: 200,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('GET /rewards - should return isPurchased flag correctly', async () => {
    const reward1 = await prisma.reward.create({
      data: { name: 'Reward 1', description: 'd', price: 10 },
    });
    const reward2 = await prisma.reward.create({
      data: { name: 'Reward 2', description: 'd', price: 10 },
    });
    await prisma.userReward.create({
      data: { userId: mockUser.id, rewardId: reward1.id },
    });

    const { body } = await request(app.getHttpServer())
      .get('/rewards')
      .set('Authorization', authToken)
      .expect(200);

    expect(body.find((r) => r.id === reward1.id).isPurchased).toBe(true);
    expect(body.find((r) => r.id === reward2.id).isPurchased).toBe(false);
  });

  it('POST /rewards/:id/purchase - should succeed with enough points and fail without', async () => {
    const reward = await prisma.reward.create({
      data: { name: 'Test Reward', description: 'd', price: 150 },
    });

    await request(app.getHttpServer())
      .post(`/rewards/${reward.id}/purchase`)
      .set('Authorization', authToken)
      .expect(201);

    const userAfterPurchase = await prisma.user.findUnique({
      where: { id: mockUser.id },
    });
    expect(userAfterPurchase).not.toBeNull();
    expect(userAfterPurchase!.karmaPoints).toBe(50);

    await request(app.getHttpServer())
      .post(`/rewards/${reward.id}/purchase`)
      .set('Authorization', authToken)
      .expect(403);
  });
});