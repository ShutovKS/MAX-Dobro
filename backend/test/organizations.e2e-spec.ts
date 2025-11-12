import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { OptionalAuthGuard } from '../src/auth/guards/optional-auth.guard';

describe('Organizations (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 20,
    supabaseUserId: 'test-supabase-id-orgs',
    email: 'orgs-test@example.com',
    name: 'Orgs Tester',
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

  @Injectable()
  class MockOptionalAuthGuard extends AuthGuard implements CanActivate {
    constructor() {
      super(null as any, null as any);
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (token) {
        request.user = mockUser;
      }
      return true;
    }
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(OptionalAuthGuard)
      .useClass(MockOptionalAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
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
    if (app) await app.close();
  });

  describe('/organizations (GET)', () => {
    it('should return organizations with isSubscribed=false for authenticated user', async () => {
      await prisma.organization.create({ data: { name: 'Org 1' } });

      const response = await request(app.getHttpServer())
        .get('/organizations')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Org 1');
      expect(response.body[0].isSubscribed).toBe(false);
    });

    it('should return organizations without isSubscribed field for unauthenticated user', async () => {
      await prisma.organization.create({ data: { name: 'Org 1' } });

      const response = await request(app.getHttpServer()).get('/organizations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).not.toHaveProperty('isSubscribed');
    });
  });

  describe('Subscription Flow', () => {
    it('should allow a user to subscribe, check status, and unsubscribe', async () => {
      const org = await prisma.organization.create({
        data: { name: 'Test Org' },
      });

      await request(app.getHttpServer())
        .post(`/organizations/${org.id}/subscribe`)
        .set('Authorization', 'Bearer fake-token')
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/organizations/${org.id}`)
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body.isSubscribed).toBe(true);

      await request(app.getHttpServer())
        .post(`/organizations/${org.id}/subscribe`)
        .set('Authorization', 'Bearer fake-token')
        .expect(409);

      await request(app.getHttpServer())
        .delete(`/organizations/${org.id}/unsubscribe`)
        .set('Authorization', 'Bearer fake-token')
        .expect(204);

      const finalResponse = await request(app.getHttpServer())
        .get(`/organizations/${org.id}`)
        .set('Authorization', 'Bearer fake-token');

      expect(finalResponse.status).toBe(200);
      expect(finalResponse.body.isSubscribed).toBe(false);

      await request(app.getHttpServer())
        .delete(`/organizations/${org.id}/unsubscribe`)
        .set('Authorization', 'Bearer fake-token')
        .expect(404);
    });
  });
});