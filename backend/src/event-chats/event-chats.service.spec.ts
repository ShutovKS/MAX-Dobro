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
