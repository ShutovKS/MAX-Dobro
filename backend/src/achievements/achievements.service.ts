import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.achievement.findMany();
  }

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
}