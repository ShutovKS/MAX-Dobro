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
    await prisma.story.deleteMany();
    await prisma.user.deleteMany(); // Ensure user is clean for each test
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/stories (POST)', () => {
    it('should create a new story', async () => {
      const dto = {
        title: 'My New Story',
        coverImageUrl: 'http://example.com/image.png',
        content: 'This is the content.',
      };

      const response = await request(app.getHttpServer())
        .post('/stories')
        .send(dto)
        .expect(201);

      expect(response.body.title).toBe(dto.title);
      expect(response.body).toHaveProperty('id');

      const storyInDb = await prisma.story.findUnique({
        where: { id: response.body.id },
      });
      expect(storyInDb).not.toBeNull();
      expect(storyInDb?.content).toBe(dto.content);
    });

    it('should return 400 if payload is invalid', () => {
      const invalidDto = { title: 'Only title' }; // Missing other required fields
      return request(app.getHttpServer())
        .post('/stories')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/stories (GET)', () => {
    it('should return a list of stories with only preview fields', async () => {
      await prisma.story.create({
        data: {
          title: 'Story 1',
          coverImageUrl: 'url1',
          content: 'Full content 1',
        },
      });
      await prisma.story.create({
        data: {
          title: 'Story 2',
          coverImageUrl: 'url2',
          content: 'Full content 2',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/stories')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Story 2'); // Ordered by date desc
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('coverImageUrl');
      expect(response.body[0]).not.toHaveProperty('content');
    });
  });

  describe('/stories/:id (GET)', () => {
    it('should return the full content of a single story', async () => {
      const story = await prisma.story.create({
        data: {
          title: 'Full Story',
          coverImageUrl: 'url_full',
          content: 'This is the complete content of the story.',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/stories/${story.id}`)
        .expect(200);

      expect(response.body.id).toBe(story.id);
      expect(response.body.title).toBe(story.title);
      expect(response.body.content).toBe(story.content);
    });

    it('should return 404 if story does not exist', () => {
      return request(app.getHttpServer()).get('/stories/99999').expect(404);
    });
  });
});