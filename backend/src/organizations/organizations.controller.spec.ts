// FILE: backend/src/organizations/organizations.controller.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit smoke test that OrganizationsController can be constructed with mocked deps.
//   SCOPE: TestingModule wiring, AuthGuard overrides, defined assertion
//   DEPENDS: M-ORGANIZATIONS, M-AUTH, M-EVENTS, M-REVIEWS
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockGuard - AuthGuard/OptionalAuthGuard stub that always activates
//   controller - OrganizationsController under test
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { EventsService } from '../events/events.service';
import { ReviewsService } from '../reviews/reviews.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  // START_BLOCK_SETUP
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        { provide: OrganizationsService, useValue: {} },
        { provide: ReviewsService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });
  // END_BLOCK_SETUP

  // START_BLOCK_TEST_DEFINED
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // END_BLOCK_TEST_DEFINED
});
