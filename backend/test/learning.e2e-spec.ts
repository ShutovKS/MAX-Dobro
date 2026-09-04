// FILE: backend/test/learning.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for completing a course and issuing a certificate.
//   SCOPE: POST /courses/:id/complete with correct quiz answers
//   DEPENDS: M-LEARNING, M-AUTH
//   LINKS: V-M-LEARNING
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockAuthGuard - injects mockUser onto the request
//   POST /courses/:id/complete - issues a user certificate
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { clearDatabase } from './test-utils';

describe('Learning (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

  // START_CONTRACT: mockAuthGuard
  //   PURPOSE: Inject mockUser as request.user for protected routes
  //   INPUTS: { context: ExecutionContext }
  //   OUTPUTS: { true }
  //   SIDE_EFFECTS: mutates request.user
  //   LINKS: V-M-LEARNING
  // END_CONTRACT: mockAuthGuard
  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  // START_BLOCK_SETUP_APP
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
        email: 'learning-test@example.com',
        supabaseUserId: 'test-supabase-id-learning',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('POST /courses/:id/complete - should successfully complete a course', async () => {
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
                  create: [{ answer: 'Correct', isCorrect: true }],
                },
              },
            },
          },
        },
      },
      include: {
        lessons: { include: { questions: { include: { answers: true } } } },
      },
    });

    const questionId = course.lessons[0].questions[0].id;
    const correctAnswerId = course.lessons[0].questions[0].answers[0].id;

    await request(app.getHttpServer())
      .post(`/courses/${course.id}/complete`)
      .set('Authorization', authToken)
      .send({ answers: [{ questionId, answerId: correctAnswerId }] })
      .expect(201);

    const certificate = await prisma.userCertificate.findFirst();
    expect(certificate).not.toBeNull();
    expect(certificate?.userId).toBe(mockUser.id);
  });
  // END_BLOCK_SCENARIOS
});
