// FILE: backend/src/event-chats/event-chats.controller.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit smoke test for EventChatsController wiring.
//   SCOPE: Controller is defined with stub service and AuthGuard
//   DEPENDS: M-EVENT-CHATS, M-AUTH
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockGuard - AuthGuard stub that always allows
//   describe-EventChatsController - definition smoke check
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EventChatsController } from './event-chats.controller';
import { EventChatsService } from './event-chats.service';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('EventChatsController', () => {
  let controller: EventChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventChatsController],
      providers: [{ provide: EventChatsService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<EventChatsController>(EventChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
