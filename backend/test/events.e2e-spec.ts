import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { clearDatabase } from './test-utils';

describe('Events (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;

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
        email: 'events-test@example.com',
        supabaseUserId: 'test-supabase-id-events',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('GET /organizations/:id/events', async () => {
    const org1 = await prisma.organization.create({
      data: { name: 'Org With Events' },
    });
    const event1 = await prisma.event.create({
      data: {
        title: 'Event 1 for Org 1',
        description: 'Desc',
        date: new Date(),
        organizationId: org1.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/organizations/${org1.id}/events`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe(event1.title);
  });
});