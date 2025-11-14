import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;

  beforeAll(async () => {
    await prisma.storyLike.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.story.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    mockUser = await prisma.user.create({
      data: {
        id: 60,
        email: 'chatbot-user@test.com',
        supabaseUserId: 'supa-chatbot-user',
        avatarUrl: null,
      },
    });
  });

  beforeEach(async () => {
    await prisma.chatMessage.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
  });

  afterAll(async () => {
    await prisma.chatMessage.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('POST /chat/messages - should return suggestions for a generic query', async () => {
    const dto = { text: 'Привет!' };
    const response = await request(app.getHttpServer())
      .post('/chat/messages')
      .send(dto)
      .expect(201);

    expect(response.body.sender).toBe('assistant');
    expect(response.body.type).toBe('suggestion-chips');
    expect(response.body.suggestions).toEqual([
      'Ближайшие события',
      'Доступные курсы',
    ]);
  });

  it('POST /chat/messages - should return an event card if query contains "события"', async () => {
    const org = await prisma.organization.create({ data: { name: 'Test Org' } });
    await prisma.event.create({
      data: {
        title: 'Test Event',
        description: '...',
        date: new Date(),
        organizationId: org.id,
      },
    });

    const dto = { text: 'Какие есть события?' };
    const response = await request(app.getHttpServer())
      .post('/chat/messages')
      .send(dto)
      .expect(201);

    expect(response.body.sender).toBe('assistant');
    expect(response.body.type).toBe('event-card');
    expect(response.body.event).toBeDefined();
    expect(response.body.event.title).toBe('Test Event');
  });

  it('GET /chat/messages - should return message history with correct structure', async () => {
    await prisma.chatMessage.create({
      data: { authorId: mockUser.id, content: 'Test message', sender: 'USER' },
    });

    const response = await request(app.getHttpServer())
      .get('/chat/messages')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].text).toBe('Test message');
    expect(response.body[0].sender).toBe('user');
    expect(response.body[0].type).toBe('text');
  });
});