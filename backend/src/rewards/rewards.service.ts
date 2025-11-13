import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reward.findMany({
      orderBy: {
        cost: 'asc',
      },
    });
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
        // This case should ideally not be hit if AuthGuard is working
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