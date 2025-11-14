import { Test, TestingModule } from '@nestjs/testing';
import { EventChatsController } from './event-chats.controller';

describe('EventChatsController', () => {
  let controller: EventChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventChatsController],
    }).compile();

    controller = module.get<EventChatsController>(EventChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
