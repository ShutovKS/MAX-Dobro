import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ChallengesService } from './challenges.service';

describe('ChallengesService', () => {
  let service: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
