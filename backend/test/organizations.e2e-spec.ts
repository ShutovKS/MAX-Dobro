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
    it('should return a paginated list of events for a specific organization', async () => {
      const org = await prisma.organization.create({
        data: { name: 'Org With Many Events' },
      });

      // Создаем 12 событий для проверки пагинации
      for (let i = 0; i < 12; i++) {
        await prisma.event.create({
          data: {
            title: `Event ${i}`,
            description: 'Desc',
            date: new Date(),
            organizationId: org.id,
          },
        });
      }
      const responseDefault = await request(app.getHttpServer())
        .get(`/organizations/${org.id}/events`)
        .expect(200);

      expect(responseDefault.body).toHaveLength(10);
      expect(responseDefault.body[0].title).toBe('Event 0');

      const responsePage2 = await request(app.getHttpServer())
        .get(`/organizations/${org.id}/events?page=2&limit=5`)
        .expect(200);

      expect(responsePage2.body).toHaveLength(5);
      expect(responsePage2.body[0].title).toBe('Event 5');

      const responseLastPage = await request(app.getHttpServer())
        .get(`/organizations/${org.id}/events?page=3&limit=5`)
        .expect(200);
      expect(responseLastPage.body).toHaveLength(2);
      expect(responseLastPage.body[0].title).toBe('Event 10');
    });

    it('should return 404 if organization does not exist', async () => {
      await request(app.getHttpServer())
        .get('/organizations/99999/events')
        .expect(404);
    });
  });
});