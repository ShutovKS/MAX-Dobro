import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Stories (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 40,
    supabaseUserId: 'test-supabase-id-stories',
    email: 'stories-test@example.com',
    name: 'Stories Tester',
    totalHours: 0,
    karmaPoints: 0,
    avatarUrl: null,
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await prisma.storyLike.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.story.deleteMany();
    await prisma.userReward.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.userCertificate.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.userOrganizationSubscription.deleteMany();
    await prisma.karmaLog.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/stories/:id/like (POST & DELETE)', () => {
    it('should allow a user to like and then unlike a story', async () => {
      const org = await prisma.organization.create({ data: { name: 'Like Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Likeable Event',
          description: 'desc',
          date: new Date(),
          organizationId: org.id,
        },
      });
      const story = await prisma.story.create({
        data: {
          text: 'A story to be liked',
          imageUrl: 'url',
          authorId: mockUser.id,
          eventId: event.id,
        },
      });

      await request(app.getHttpServer())
        .post(`/stories/${story.id}/like`)
        .expect(204);

      let storyInDb = await prisma.story.findUnique({
        where: { id: story.id },
        include: { _count: { select: { likes: true } } },
      });
      expect(storyInDb?._count.likes).toBe(1);

      await request(app.getHttpServer())
        .delete(`/stories/${story.id}/like`)
        .expect(204);

      storyInDb = await prisma.story.findUnique({
        where: { id: story.id },
        include: { _count: { select: { likes: true } } },
      });
      expect(storyInDb?._count.likes).toBe(0);
    });
  });

  describe('/stories (GET)', () => {
    it('should return a list of stories', async () => {
      const org = await prisma.organization.create({ data: { name: 'Story Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Story Event',
          description: 'desc',
          date: new Date(),
          organizationId: org.id,
        },
      });
      await prisma.story.create({
        data: {
          text: 'Story 1',
          imageUrl: 'url1',
          authorId: mockUser.id,
          eventId: event.id,
        },
      });
      
      const response = await request(app.getHttpServer())
        .get('/stories')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].text).toBe('Story 1');
    });
  });
});