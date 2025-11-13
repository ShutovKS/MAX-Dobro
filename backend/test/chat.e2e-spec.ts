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

  let mockUser1: User;
  let mockUser2: User;

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser1;
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

    await prisma.chatMessage.deleteMany();
    await prisma.chatParticipant.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
    mockUser1 = await prisma.user.create({
      data: {
        id: 51,
        email: 'user1@chat.test',
        supabaseUserId: 'supa-user1-chat',
      },
    });
    mockUser2 = await prisma.user.create({
      data: {
        id: 52,
        email: 'user2@chat.test',
        supabaseUserId: 'supa-user2-chat',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('Chat Endpoints', () => {
    let chatId: number;

    beforeEach(async () => {
      await prisma.chatMessage.deleteMany();
      await prisma.chatParticipant.deleteMany();
      await prisma.chat.deleteMany();

      const chat = await prisma.chat.create({ data: {} });
      chatId = chat.id;

      await prisma.chatParticipant.createMany({
        data: [
          { chatId, userId: mockUser1.id },
          { chatId, userId: mockUser2.id },
        ],
      });
      await prisma.chatMessage.create({
        data: {
          chatId,
          authorId: mockUser1.id,
          content: 'Hello!',
        },
      });
      const lastMessage = await prisma.chatMessage.create({
        data: {
          chatId,
          authorId: mockUser2.id,
          content: 'Hi there!',
        },
      });
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: lastMessage.createdAt },
      });
    });

    it('POST /chats - should create a new chat if one does not exist', async () => {
      await prisma.chatParticipant.deleteMany();
      await prisma.chat.deleteMany();

      const dto = { recipientId: mockUser2.id };
      const response = await request(app.getHttpServer())
        .post('/chats')
        .send(dto)
        .expect(201); // 201 Created

      expect(response.body).toHaveProperty('id');

      const participants = await prisma.chatParticipant.findMany({
        where: { chatId: response.body.id },
      });
      expect(participants).toHaveLength(2);
    });

    it('POST /chats - should return an existing chat if one exists', async () => {
      const dto = { recipientId: mockUser2.id };
      const response = await request(app.getHttpServer())
        .post('/chats')
        .send(dto)
        .expect(200); // 200 OK

      expect(response.body.id).toBe(chatId);
    });



    it('POST /chats - should return 400 when trying to chat with oneself', async () => {
      const dto = { recipientId: mockUser1.id };
      await request(app.getHttpServer())
        .post('/chats')
        .send(dto)
        .expect(400);
    });

    it('POST /chats/:id/messages - should allow a participant to send a message', async () => {
      const dto = { content: 'This is a new message' };
      const response = await request(app.getHttpServer())
        .post(`/chats/${chatId}/messages`)
        .send(dto)
        .expect(201);

      expect(response.body.content).toBe(dto.content);
      expect(response.body.authorId).toBe(mockUser1.id);
    });

    it('POST /chats/:id/messages - should return 403 for a non-participant', async () => {
      const otherChat = await prisma.chat.create({ data: {} });
      const dto = { content: 'Trying to hack' };
      await request(app.getHttpServer())
        .post(`/chats/${otherChat.id}/messages`)
        .send(dto)
        .expect(403);
    });

    it('GET /chats - should return the list of chats for the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/chats')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(chatId);
      expect(response.body[0].recipient.id).toBe(mockUser2.id);
      expect(response.body[0].lastMessage.content).toBe('Hi there!');
    });

    it('GET /chats/:id/messages - should return messages from a chat', async () => {
      const response = await request(app.getHttpServer())
        .get(`/chats/${chatId}/messages`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].content).toBe('Hi there!');
    });

    it('GET /chats/:id/messages - should respect pagination', async () => {
      const response = await request(app.getHttpServer())
        .get(`/chats/${chatId}/messages?page=1&limit=1`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].content).toBe('Hi there!');
    });

    it('GET /chats/:id/messages - should return 403 for a non-participant', async () => {
      const otherChat = await prisma.chat.create({ data: {} });
      await request(app.getHttpServer())
        .get(`/chats/${otherChat.id}/messages`)
        .expect(403);
    });
  });
});