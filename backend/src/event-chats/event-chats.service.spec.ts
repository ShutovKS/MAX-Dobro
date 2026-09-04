// FILE: backend/src/event-chats/event-chats.service.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit smoke test for EventChatsService wiring.
//   SCOPE: Service is defined with stub PrismaService
//   DEPENDS: M-EVENT-CHATS, M-PRISMA
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   describe-EventChatsService - definition smoke check with Prisma stub
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EventChatsService } from './event-chats.service';

describe('EventChatsService', () => {
  let service: EventChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventChatsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<EventChatsService>(EventChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
