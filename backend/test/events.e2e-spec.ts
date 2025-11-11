import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { TasksService } from '../src/tasks/tasks.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Events (e2e)', () => {
  let app: INestApplication;
  let tasksService: TasksService;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser = {
    id: 1,
    supabaseUserId: 'test-supabase-id-events',
    email: 'events-test@example.com',
  };

  const mockAuthGuard = {
    canActivate: (context) => {
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

    await prisma.user.upsert({
      where: { id: mockUser.id },
      update: {},
      create: { ...mockUser, name: 'Events Tester' },
    });
  });

  beforeEach(async () => {
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: { ...mockUser, name: 'Events Tester' },
    });
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

    it('should return 403 Forbidden if event is full', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Full Event',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
          maxParticipants: 1,
        },
      });

      const otherUser = await prisma.user.create({
        data: {
          id: 999,
          email: 'other@user.com',
          supabaseUserId: 'other-user-id',
        },
      });

      await prisma.eventParticipant.create({
        data: { eventId: event.id, userId: otherUser.id },
      });

      await request(app.getHttpServer())
        .post(`/events/${event.id}/participate`)
        .expect(403);
    });
  });

  describe('/events/:id/participate (DELETE)', () => {
    it('should allow a user to cancel their participation', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Event to cancel',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
        },
      });
      await prisma.eventParticipant.create({
        data: { eventId: event.id, userId: mockUser.id },
      });

      await request(app.getHttpServer())
        .delete(`/events/${event.id}/participate`)
        .expect(204);

      const participation = await prisma.eventParticipant.findFirst();
      expect(participation).toBeNull();
    });
  });

  describe('Background Tasks (TasksService)', () => {
    it('should process a past event, award hours, karma, and achievements', async () => {
      // 1. Arrange
      await prisma.user.update({
        where: { id: mockUser.id },
        data: { totalHours: 0, karmaPoints: 0 },
      });

      const org = await prisma.organization.create({
        data: { name: 'Async Org' },
      });
      await prisma.achievement.create({
        data: {
          id: 100,
          name: 'First Hour',
          description: 'Test',
          criteriaType: 'TOTAL_HOURS',
          criteriaValue: 1,
        },
      });

      const pastEventDate = new Date();
      pastEventDate.setHours(pastEventDate.getHours() - 2);

      const event = await prisma.event.create({
        data: {
          title: 'Past Event for Async Test',
          description: 'Desc',
          date: pastEventDate,
          organizationId: org.id,
          durationHours: 1,
          karmaPoints: 50,
          status: 'PLANNED',
        },
      });

      await prisma.eventParticipant.create({
        data: { eventId: event.id, userId: mockUser.id, status: 'approved' },
      });

      // 2. Act
      await tasksService.handleEventCompletion(event.id);

      // 3. Assert
      const response = await request(app.getHttpServer()).get('/profile/me');

      expect(response.status).toBe(200);
      expect(response.body.totalHours).toBe(1);
      expect(response.body.karmaPoints).toBe(50);
      expect(response.body.achievements).toHaveLength(1);
      expect(response.body.achievements[0].achievement.name).toBe('First Hour');
    });
  });
});