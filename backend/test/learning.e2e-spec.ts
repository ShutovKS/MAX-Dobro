import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Learning (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser = {
    id: 2,
    supabaseUserId: 'test-supabase-id-learning',
    email: 'learning-test@example.com',
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    await prisma.user.upsert({
      where: { id: mockUser.id },
      update: {},
      create: { ...mockUser, name: 'Learning Tester' },
    });
  });

  beforeEach(async () => {
    await prisma.userCertificate.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/courses/:id/complete (POST)', () => {
    it('should successfully complete a course with correct answers', async () => {
      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          description: 'Desc',
          lessons: {
            create: {
              title: 'Lesson 1',
              content: 'Content',
              questions: {
                create: {
                  question: 'Q1',
                  answers: {
                    create: [
                      { answer: 'Wrong', isCorrect: false },
                      { answer: 'Correct', isCorrect: true },
                    ],
                  },
                },
              },
            },
          },
        },
        include: { lessons: { include: { questions: { include: { answers: true } } } } },
      });

      const questionId = course.lessons[0].questions[0].id;
      const correctAnswerId = course.lessons[0].questions[0].answers[1].id;

      await request(app.getHttpServer())
        .post(`/courses/${course.id}/complete`)
        .send({ answers: [{ questionId, answerId: correctAnswerId }] })
        .expect(201);

      const certificate = await prisma.userCertificate.findFirst();
      expect(certificate).not.toBeNull();
      expect(certificate?.userId).toBe(mockUser.id);
    });

    it('should return 400 Bad Request for incorrect answers', async () => {
      const course = await prisma.course.create({
        data: {
          title: 'Test Course 2',
          description: 'Desc',
          lessons: {
            create: {
              title: 'Lesson 1',
              content: 'Content',
              questions: {
                create: {
                  question: 'Q1',
                  answers: {
                    create: [
                      { answer: 'Wrong', isCorrect: false },
                      { answer: 'Correct', isCorrect: true },
                    ],
                  },
                },
              },
            },
          },
        },
        include: { lessons: { include: { questions: { include: { answers: true } } } } },
      });

      const questionId = course.lessons[0].questions[0].id;
      const wrongAnswerId = course.lessons[0].questions[0].answers[0].id;

      await request(app.getHttpServer())
        .post(`/courses/${course.id}/complete`)
        .send({ answers: [{ questionId, answerId: wrongAnswerId }] })
        .expect(400);
    });
  });
});