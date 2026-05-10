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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
