import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { clearDatabase } from './test-utils';

describe('Event Chats (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  let otherUser: User;
  const authToken = 'Bearer test-token';

  beforeAll(async () => {
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
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    mockUser = await prisma.user.create({
      data: {
        email: 'event-chat-user@test.com',
        supabaseUserId: 'supa-event-chat-user',
      },
    });
    otherUser = await prisma.user.create({
      data: {
        email: 'other-user@test.com',
        supabaseUserId: 'supa-other-user',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('GET /chats & /chats/:id/messages - should manage event chats correctly', async () => {
    const org = await prisma.organization.create({ data: { name: 'Test Org' } });
    const event = await prisma.event.create({
      data: {
        title: 'Event with chat', description: 'd', date: new Date(), organizationId: org.id,
      },
    });
    await prisma.eventParticipant.create({
      data: { eventId: event.id, userId: mockUser.id, status: 'approved' },
    });
    const eventWithoutChat = await prisma.event.create({
        data: {
            title: 'Event without chat', description: 'd', date: new Date(), organizationId: org.id,
        }
    })
    await prisma.eventParticipant.create({
        data: { eventId: eventWithoutChat.id, userId: mockUser.id, status: 'approved' },
      });


    const chat = await prisma.eventChat.create({ data: { eventId: event.id } });
    await prisma.eventChatMessage.create({
      data: { chatId: chat.id, authorId: otherUser.id, text: 'Hello from other user!' },
    });

    const { body: chatList } = await request(app.getHttpServer())
      .get('/chats')
      .set('Authorization', authToken)
      .expect(200);

    expect(chatList).toHaveLength(1);
    expect(chatList[0].eventTitle).toBe('Event with chat');
    expect(chatList[0].lastMessage).toBe('Hello from other user!');

    const { body: messages } = await request(app.getHttpServer())
      .get(`/chats/${chat.id}/messages`)
      .set('Authorization', authToken)
      .expect(200);

    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('Hello from other user!');
    expect(messages[0].author.id).toBe(otherUser.id);
  });
});