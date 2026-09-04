// FILE: backend/src/achievements/achievements.service.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit tests for checkAndAwardAchievements criteria, duplicates, and skips.
//   SCOPE: award when criteria met, skip existing awards, skip unmet criteria
//   DEPENDS: M-ACHIEVEMENTS, M-PRISMA
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   mockPrismaService - user/achievement/userAchievement Prisma stubs
//   service - AchievementsService under test
//   prisma - injected mock Prisma handle
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from './achievements.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  achievement: {
    findMany: jest.fn(),
  },
  userAchievement: {
    createMany: jest.fn(),
  },
};

describe('AchievementsService', () => {
  let service: AchievementsService;
  let prisma: typeof mockPrismaService;

  // START_BLOCK_SETUP
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });
  // END_BLOCK_SETUP

  // START_BLOCK_TEST_AWARD_WHEN_MET
  it('should award a new achievement if criteria are met', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithNoAchievements = {
      id: userId,
      totalHours: 10,
      karmaPoints: 100,
      achievements: [],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
      { id: 2, criteriaType: 'KARMA_POINTS', criteriaValue: 500 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithNoAchievements);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).toHaveBeenCalledWith({
      data: [{ userId, achievementId: 1 }],
    });
    expect(prisma.userAchievement.createMany).toHaveBeenCalledTimes(1);
  });
  // END_BLOCK_TEST_AWARD_WHEN_MET

  // START_BLOCK_TEST_SKIP_EXISTING
  it('should not award an achievement if user already has it', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithOneAchievement = {
      id: userId,
      totalHours: 10,
      karmaPoints: 100,
      achievements: [{ userId: 1, achievementId: 1 }],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithOneAchievement);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).not.toHaveBeenCalled();
  });
  // END_BLOCK_TEST_SKIP_EXISTING

  // START_BLOCK_TEST_SKIP_UNMET
  it('should not award an achievement if criteria are not met', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithLowStats = {
      id: userId,
      totalHours: 5,
      karmaPoints: 50,
      achievements: [],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithLowStats);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).not.toHaveBeenCalled();
  });
  // END_BLOCK_TEST_SKIP_UNMET
});
