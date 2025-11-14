import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  LeaderboardPeriod,
  LeaderboardQueryDto,
} from './dto/leaderboard-query.dto';
import { LeaderboardResponseEntity } from './entities/leaderboard-response.entity';
import { LeaderboardUserEntity } from './entities/leaderboard-user.entity';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(
    query: LeaderboardQueryDto,
    currentUser: User,
  ): Promise<LeaderboardResponseEntity> {
    const limit = query.limit ?? 50;
    const period = query.period ?? LeaderboardPeriod.ALL_TIME;

    if (period === LeaderboardPeriod.ALL_TIME) {
      return this.getAllTimeLeaderboard(limit, currentUser.id);
    }
    return this.getPeriodicalLeaderboard(period, limit, currentUser.id);
  }

  private getStartDate(period: LeaderboardPeriod): Date {
    const now = new Date();
    if (period === LeaderboardPeriod.WEEK) {
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      return lastWeek;
    }
    if (period === LeaderboardPeriod.MONTH) {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      return lastMonth;
    }
    return new Date(0);
  }

  private async getAllTimeLeaderboard(
    limit: number,
    currentUserId: number,
  ): Promise<LeaderboardResponseEntity> {
    const topUsers = await this.prisma.user.findMany({
      take: limit,
      orderBy: [{ karmaPoints: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        name: true,
        karmaPoints: true,
        avatarUrl: true,
      },
    });

    const topUsersWithRank: LeaderboardUserEntity[] = topUsers.map(
      ({ karmaPoints, ...user }, index) => ({
        ...user,
        karma: karmaPoints,
        rank: index + 1,
      }),
    );

    const currentUserData = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true, name: true, karmaPoints: true, avatarUrl: true },
    });

    let currentUserWithRank: LeaderboardUserEntity | null = null;
    if (currentUserData) {
      const rank = await this.prisma.user.count({
        where: { karmaPoints: { gt: currentUserData.karmaPoints } },
      });
      const { karmaPoints, ...rest } = currentUserData;
      currentUserWithRank = { ...rest, karma: karmaPoints, rank: rank + 1 };
    }

    return { topUsers: topUsersWithRank, currentUser: currentUserWithRank };
  }

  private async getPeriodicalLeaderboard(
    period: LeaderboardPeriod,
    limit: number,
    currentUserId: number,
  ): Promise<LeaderboardResponseEntity> {
    const startDate = this.getStartDate(period);

    type RawLeaderboardUser = {
      id: number;
      name: string | null;
      avatarUrl: string | null;
      karma: number;
      rank: bigint;
    };

    const leaderboard: RawLeaderboardUser[] = await this.prisma.$queryRaw`
      WITH ranked_users AS (
        SELECT
          u.id,
          u.name,
          u."avatarUrl",
          SUM(kl.points)::int AS "karma",
          RANK() OVER (ORDER BY SUM(kl.points) DESC, u.id ASC) AS "rank"
        FROM "karma_logs" kl
        JOIN "User" u ON u.id = kl."userId"
        WHERE kl."createdAt" >= ${startDate}
        GROUP BY u.id
      )
      SELECT * FROM ranked_users
      WHERE "rank" <= ${limit} OR id = ${currentUserId}
      ORDER BY "rank" ASC;
    `;

    const formattedLeaderboard: LeaderboardUserEntity[] = leaderboard.map(
      (u) => ({ ...u, rank: Number(u.rank) }),
    );

    const topUsers = formattedLeaderboard.filter((u) => u.rank <= limit);
    const currentUser =
      formattedLeaderboard.find((u) => u.id === currentUserId) || null;

    return { topUsers, currentUser };
  }
}