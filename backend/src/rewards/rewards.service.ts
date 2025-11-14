import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardEntity } from './entities/reward.entity';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: number): Promise<RewardEntity[]> {
    const rewards = await this.prisma.reward.findMany({
      orderBy: { cost: 'asc' },
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
      id: r.id,
      name: r.title,
      description: r.description,
      price: r.cost,
      imageUrl: r.icon,
      category: r.category ?? 'Разное',
      isPurchased: userId ? userRewardIds.has(r.id) : undefined,
    }));
  }

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

      if (user.karmaPoints < reward.cost) {
        throw new ForbiddenException('Insufficient karma points.');
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          karmaPoints: {
            decrement: reward.cost,
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
}