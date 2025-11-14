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

  it('/profile/me (GET) - should return current user profile', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', authToken)
      .expect(200);

    expect(body.email).toBe(mockUser.email);
    expect(body.name).toBe('Test User');
    expect(body.level).toBe('Активист');
  });
});