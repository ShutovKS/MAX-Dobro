// FILE: backend/src/challenges/challenges.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Return the active weekly challenge for the volunteer home surface.
//   SCOPE: Latest active WEEKLY challenge plus per-user progress
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-CHALLENGES, V-M-CHALLENGES, class-ChallengesService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ChallengesService - weekly challenge payload
//   findWeekly - active weekly challenge with user progress
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// START_CONTRACT: ChallengesService
//   PURPOSE: Query the active weekly challenge and user progress
//   INPUTS: { userId: number }
//   OUTPUTS: { Challenge payload | null }
//   SIDE_EFFECTS: none
//   LINKS: M-CHALLENGES, V-M-CHALLENGES, M-PRISMA, BLOCK_WEEKLY_CHALLENGE
// END_CONTRACT: ChallengesService
@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: findWeekly
  //   PURPOSE: Load the latest active weekly challenge and map progress
  //   INPUTS: { userId: number }
  //   OUTPUTS: { Promise<Challenge | null> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-CHALLENGES, V-M-CHALLENGES, BLOCK_WEEKLY_CHALLENGE
  // END_CONTRACT: findWeekly
  async findWeekly(userId: number) {
    // START_BLOCK_WEEKLY_CHALLENGE
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
    // END_BLOCK_WEEKLY_CHALLENGE
  }
}
