import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async findWeekly(userId: number) {
    const weeklyChallenge = await this.prisma.challenge.findFirst({
      where: {
        period: 'WEEKLY',
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!weeklyChallenge) {
      return null;
    }

    const userProgress = await this.prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: weeklyChallenge.id,
        },
      },
    });

    return {
      title: weeklyChallenge.title,
      description: weeklyChallenge.description,
      reward: weeklyChallenge.reward,
      progress: userProgress?.progress ?? 0,
      target: weeklyChallenge.criteriaValue,
      filterCategory: weeklyChallenge.criteriaMeta,
      isCompleted: !!userProgress?.completedAt,
    };
  }
}