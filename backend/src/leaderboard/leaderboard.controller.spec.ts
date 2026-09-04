import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('LeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [{ provide: LeaderboardService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
