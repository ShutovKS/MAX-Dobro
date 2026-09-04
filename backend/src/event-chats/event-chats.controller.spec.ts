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
