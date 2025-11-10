import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
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

  const mockAuthGuard = {
    canActivate: (context) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 1,
        supabaseUserId: 'test-supabase-id',
        email: 'test@example.com',
      };
      return true;
    },
  };

  beforeAll(async () => {
    await new Promise<void>((resolve, reject) => {
      const { exec } = require('child_process');
      exec(
        'dotenv -e ./test/.env -- npx prisma migrate deploy',
        (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            return reject(error);
          }
          console.log(stdout);
          return resolve();
        },
      );
    });

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
    await prisma.eventParticipant.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) {
      await app.close();
    }
  });

  it('/profile/me (GET) - should return current user profile', async () => {
    await prisma.user.create({
      data: {
        id: 1,
        supabaseUserId: 'test-supabase-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    return request(app.getHttpServer())
      .get('/profile/me')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.email).toBe('test@example.com');
        expect(res.body).toHaveProperty('levelName');
      });
  });
});