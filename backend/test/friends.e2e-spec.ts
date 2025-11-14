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
});