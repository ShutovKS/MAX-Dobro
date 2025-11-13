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

  describe('/organizations/:id/events (GET)', () => {
    it('should return a list of events for a specific organization', async () => {
      const org1 = await prisma.organization.create({
        data: { name: 'Org With Events' },
      });
      const org2 = await prisma.organization.create({
        data: { name: 'Org Without Events' },
      });
      const event1 = await prisma.event.create({
        data: {
          title: 'Event 1 for Org 1',
          description: 'Desc',
          date: new Date(),
          organizationId: org1.id,
        },
      });
      await prisma.event.create({
        data: {
          title: 'Event 2 for Org 1',
          description: 'Desc',
          date: new Date(),
          organizationId: org1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/organizations/${org1.id}/events`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe(event1.title);
      expect(response.body[0].organizationId).toBe(org1.id);
    });

    it('should return an empty array for an organization with no events', async () => {
      const org = await prisma.organization.create({
        data: { name: 'Org With No Events' },
      });
      const response = await request(app.getHttpServer())
        .get(`/organizations/${org.id}/events`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 404 if organization does not exist', async () => {
      await request(app.getHttpServer())
        .get('/organizations/99999/events')
        .expect(404);
    });
  });
});