import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { TasksService } from '../src/tasks/tasks.service';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let tasksService: TasksService;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 10,
    supabaseUserId: 'test-supabase-id-events',
    email: 'events-test@example.com',
    name: 'Events Tester',
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
    tasksService = app.get(TasksService);
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

  describe('/events/:id/participate (POST)', () => {
    it('should allow a user to participate in an event', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Event 1',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
        },
      });

      await request(app.getHttpServer())
        .post(`/events/${event.id}/participate`)
        .expect(201);

      const participation = await prisma.eventParticipant.findFirst();
      expect(participation).not.toBeNull();
      expect(participation?.userId).toBe(mockUser.id);
      expect(participation?.eventId).toBe(event.id);
    });

    it('should return 409 Conflict if user is already participating', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Event 2',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
        },
      });
      await prisma.eventParticipant.create({
        data: { eventId: event.id, userId: mockUser.id },
      });

      await request(app.getHttpServer())
        .post(`/events/${event.id}/participate`)
        .expect(409);
    });
  });
});