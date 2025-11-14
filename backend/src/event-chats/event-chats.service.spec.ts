import { Test, TestingModule } from '@nestjs/testing';
import { EventChatsService } from './event-chats.service';

describe('EventChatsService', () => {
  let service: EventChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventChatsService],
    }).compile();

    service = module.get<EventChatsService>(EventChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
