// FILE: backend/test/assistant-chat.e2e-spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: E2E coverage for posting an assistant-chat message.
//   SCOPE: POST /assistant-chat/messages suggestion-chip reply
//   DEPENDS: M-ASSISTANT-CHAT, M-AUTH
//   LINKS: V-M-ASSISTANT-CHAT
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   beforeAll - boot Nest app with AuthGuard override
//   POST /assistant-chat/messages - assistant suggestion-chips payload
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

describe('Assistant Chat (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

  // START_BLOCK_SETUP_APP
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
        email: 'assistant-chat-user@test.com',
        supabaseUserId: 'supa-assistant-chat-user',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });
  // END_BLOCK_SETUP_APP

  // START_BLOCK_SCENARIOS
  it('POST /assistant-chat/messages - should return suggestions', async () => {
    const dto = { text: 'Привет!' };
    const response = await request(app.getHttpServer())
      .post('/assistant-chat/messages')
      .set('Authorization', authToken)
      .send(dto)
      .expect(201);

    expect(response.body.sender).toBe('assistant');
    expect(response.body.type).toBe('suggestion-chips');
  });
  // END_BLOCK_SCENARIOS
});
