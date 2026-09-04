// FILE: backend/src/friends/friends.controller.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit smoke test for FriendsController wiring.
//   SCOPE: Controller is defined with stub service and AuthGuard
//   DEPENDS: M-FRIENDS, M-AUTH
//   LINKS: M-FRIENDS, V-M-FRIENDS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockGuard - AuthGuard stub that always allows
//   describe-FriendsController - definition smoke check
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('FriendsController', () => {
  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [{ provide: FriendsService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
