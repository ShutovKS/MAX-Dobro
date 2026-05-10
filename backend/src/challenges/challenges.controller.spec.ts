import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('ChallengesController', () => {
  let controller: ChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [{ provide: ChallengesService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ChallengesController>(ChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
