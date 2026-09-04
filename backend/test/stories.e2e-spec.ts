// FILE: backend/test/stories.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for liking and unliking a story.
//   SCOPE: POST and DELETE /stories/:id/like
//   DEPENDS: M-STORIES, M-AUTH
//   LINKS: V-M-STORIES
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockAuthGuard - injects mockUser onto the request
//   POST/DELETE /stories/:id/like - like count 1 then 0
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

describe('Stories (e2e)', () => {
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
  //   LINKS: V-M-STORIES
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
        email: 'stories-test@example.com',
        supabaseUserId: 'test-supabase-id-stories',
        firstName: 'Story',
        lastName: 'Author',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('POST & DELETE /stories/:id/like - should allow a user to like and unlike a story', async () => {
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
      .set('Authorization', authToken)
      .expect(204);

    let storyInDb = await prisma.story.findUnique({
      where: { id: story.id },
      include: { _count: { select: { likes: true } } },
    });
    expect(storyInDb?._count.likes).toBe(1);

    await request(app.getHttpServer())
      .delete(`/stories/${story.id}/like`)
      .set('Authorization', authToken)
      .expect(204);

    storyInDb = await prisma.story.findUnique({
      where: { id: story.id },
      include: { _count: { select: { likes: true } } },
    });
    expect(storyInDb?._count.likes).toBe(0);
  });
  // END_BLOCK_SCENARIOS
});
