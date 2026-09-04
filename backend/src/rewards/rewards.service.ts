// FILE: backend/src/rewards/rewards.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: List shop rewards and spend karma on a purchase.
//   SCOPE: catalog with optional isPurchased, transactional karma decrement and UserReward insert
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-REWARDS, V-M-REWARDS, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   RewardsService - catalog and purchase
//   findAll - rewards ordered by price with optional isPurchased
//   purchase - deduct karma and create UserReward in a transaction
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardEntity } from './entities/reward.entity';

@Injectable()
// START_CONTRACT: RewardsService
//   PURPOSE: List and purchase rewards
//   INPUTS: { PrismaService, userId?: number, rewardId: number }
//   OUTPUTS: { RewardEntity[], UserReward }
//   SIDE_EFFECTS: Prisma Reward/UserReward reads; transactional karma decrement and UserReward create
//   LINKS: M-REWARDS, V-M-REWARDS, M-PRISMA
// END_CONTRACT: RewardsService
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: findAll
  //   PURPOSE: List rewards ordered by price and flag those the viewer already owns
  //   INPUTS: { userId?: number }
  //   OUTPUTS: { RewardEntity[] }
  //   SIDE_EFFECTS: Prisma Reward and UserReward reads
  //   LINKS: M-REWARDS, V-M-REWARDS, M-PRISMA
  // END_CONTRACT: findAll
  // START_BLOCK_LIST_REWARDS
  async findAll(userId?: number): Promise<RewardEntity[]> {
    const rewards = await this.prisma.reward.findMany({
      orderBy: { price: 'asc' },
    });

    let userRewardIds: Set<number> = new Set();
    if (userId) {
      const userRewards = await this.prisma.userReward.findMany({
        where: { userId },
        select: { rewardId: true },
      });
      userRewardIds = new Set(userRewards.map((ur) => ur.rewardId));
    }

    return rewards.map((r) => ({
      ...r,
      isPurchased: userId ? userRewardIds.has(r.id) : undefined,
    }));
  }
  // END_BLOCK_LIST_REWARDS

  // START_CONTRACT: purchase
  //   PURPOSE: Spend karma on a reward inside a transaction
  //   INPUTS: { rewardId: number, userId: number }
  //   OUTPUTS: { UserReward }
  //   SIDE_EFFECTS: decrements User.karmaPoints and creates UserReward; throws on missing rows or insufficient karma
  //   LINKS: M-REWARDS, V-M-REWARDS, BLOCK_PURCHASE_REWARD
  // END_CONTRACT: purchase
  // START_BLOCK_PURCHASE_REWARD
  async purchase(rewardId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
      });

      if (!reward) {
        throw new NotFoundException(`Reward with ID ${rewardId} not found.`);
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      if (user.karmaPoints < reward.price) {
        throw new ForbiddenException('Insufficient karma points.');
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          karmaPoints: {
            decrement: reward.price,
          },
        },
      });

      return tx.userReward.create({
        data: {
          userId,
          rewardId,
        },
      });
    });
  }
  // END_BLOCK_PURCHASE_REWARD
}
