// FILE: backend/src/achievements/achievements.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: List achievement catalog entries and award unlocked badges to a user.
//   SCOPE: findAll catalog, check TOTAL_HOURS/KARMA_POINTS criteria, create UserAchievement rows
//   DEPENDS: M-PRISMA
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AchievementsService - achievement catalog and award checks
//   findAll - list all Achievement rows
//   checkAndAwardAchievements - grant missing achievements whose criteria the user meets
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
// START_CONTRACT: AchievementsService
//   PURPOSE: Achievement catalog and user award checks
//   INPUTS: { PrismaService, userId?: number }
//   OUTPUTS: { Achievement[], void for award checks }
//   SIDE_EFFECTS: Prisma Achievement reads; UserAchievement createMany
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS, M-PRISMA
// END_CONTRACT: AchievementsService
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: findAll
  //   PURPOSE: Return the full achievement catalog
  //   INPUTS: { none }
  //   OUTPUTS: { Achievement[] }
  //   SIDE_EFFECTS: Prisma Achievement findMany
  //   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS, BLOCK_LIST_ACHIEVEMENTS
  // END_CONTRACT: findAll
  // START_BLOCK_LIST_ACHIEVEMENTS
  findAll() {
    return this.prisma.achievement.findMany();
  }
  // END_BLOCK_LIST_ACHIEVEMENTS

  // START_CONTRACT: checkAndAwardAchievements
  //   PURPOSE: Award catalog achievements the user newly qualifies for
  //   INPUTS: { userId: number }
  //   OUTPUTS: { void }
  //   SIDE_EFFECTS: reads User and Achievement; may create UserAchievement rows; logs check/award
  //   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS, M-PRISMA
  // END_CONTRACT: checkAndAwardAchievements
  // START_BLOCK_CHECK_AND_AWARD
  async checkAndAwardAchievements(userId: number) {
    this.logger.log(`Checking achievements for user ID: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { achievements: true },
    });

    if (!user) {
      this.logger.warn(`User ${userId} not found, skipping achievement check.`);
      return;
    }

    const allAchievements = await this.findAll();
    const userAchievementIds = new Set(
      user.achievements.map((ua) => ua.achievementId),
    );

    const achievementsToAward: number[] = [];

    for (const achievement of allAchievements) {
      if (userAchievementIds.has(achievement.id)) {
        continue;
      }

      let unlocked = false;
      switch (achievement.criteriaType) {
        case 'TOTAL_HOURS':
          if (user.totalHours >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
        case 'KARMA_POINTS':
          if (user.karmaPoints >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
      }

      if (unlocked) {
        achievementsToAward.push(achievement.id);
      }
    }

    if (achievementsToAward.length > 0) {
      await this.prisma.userAchievement.createMany({
        data: achievementsToAward.map((achievementId) => ({
          userId,
          achievementId,
        })),
      });
      this.logger.log(
        `Awarded ${achievementsToAward.length} new achievements to user ${userId}.`,
      );
    }
  }
  // END_BLOCK_CHECK_AND_AWARD
}
