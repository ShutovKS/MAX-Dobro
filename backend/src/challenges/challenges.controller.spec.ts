// FILE: backend/src/challenges/challenges.controller.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit smoke test for ChallengesController wiring.
//   SCOPE: Controller is defined with stub service and AuthGuard
//   DEPENDS: M-CHALLENGES, M-AUTH
//   LINKS: M-CHALLENGES, V-M-CHALLENGES
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockGuard - AuthGuard stub that always allows
//   describe-ChallengesController - definition smoke check
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
