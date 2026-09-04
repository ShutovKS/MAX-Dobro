// FILE: backend/src/leaderboard/leaderboard.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Rank volunteers by karma or hours for leaderboard screens.
//   SCOPE: All-time karma ranking, period ranking from karma_logs, current-user rank
//   DEPENDS: M-PRISMA
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, class-LeaderboardService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardService - ranked volunteer lists
//   getLeaderboard - dispatch all-time vs period ranking
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  LeaderboardPeriod,
  LeaderboardQueryDto,
} from './dto/leaderboard-query.dto';
import { LeaderboardResponseEntity } from './entities/leaderboard-response.entity';
import { LeaderboardUserEntity } from './entities/leaderboard-user.entity';

// START_CONTRACT: LeaderboardService
//   PURPOSE: Build ranked volunteer lists for all-time or period windows
//   INPUTS: { query: LeaderboardQueryDto, currentUser: User }
//   OUTPUTS: { LeaderboardResponseEntity }
//   SIDE_EFFECTS: none
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, M-PRISMA, BLOCK_RANK_USERS
// END_CONTRACT: LeaderboardService
@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: getLeaderboard
  //   PURPOSE: Rank volunteers by karma for the requested period
  //   INPUTS: { query: LeaderboardQueryDto, currentUser: User }
  //   OUTPUTS: { Promise<LeaderboardResponseEntity> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, BLOCK_RANK_USERS
  // END_CONTRACT: getLeaderboard
  async getLeaderboard(
    query: LeaderboardQueryDto,
    currentUser: User,
  ): Promise<LeaderboardResponseEntity> {
    // START_BLOCK_RANK_USERS
    const limit = query.limit ?? 50;
    const period = query.period ?? LeaderboardPeriod.ALL_TIME;

    if (period === LeaderboardPeriod.ALL_TIME) {
      return this.getAllTimeLeaderboard(limit, currentUser.id);
    }
    return this.getPeriodicalLeaderboard(period, limit, currentUser.id);
    // END_BLOCK_RANK_USERS
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
    // START_BLOCK_ALL_TIME_LEADERBOARD
    const topUsersRaw = await this.prisma.user.findMany({
      take: limit,
      orderBy: [{ karmaPoints: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        karmaPoints: true,
        avatarUrl: true,
      },
    });

    const topUsersWithRank: LeaderboardUserEntity[] = topUsersRaw.map(
      ({ karmaPoints, firstName, lastName, ...user }, index) => ({
        ...user,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        karma: karmaPoints,
        rank: index + 1,
      }),
    );

    const currentUserData = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        karmaPoints: true,
        avatarUrl: true,
      },
    });

    let currentUserWithRank: LeaderboardUserEntity | null = null;
    if (currentUserData) {
      // Ранг считаем тем же порядком, что и topUsers (karma desc, id asc),
      // чтобы номер в списке и в футере совпадал.
      const rank = await this.prisma.user.count({
        where: {
          OR: [
            { karmaPoints: { gt: currentUserData.karmaPoints } },
            {
              karmaPoints: currentUserData.karmaPoints,
              id: { lt: currentUserData.id },
            },
          ],
        },
      });
      const { karmaPoints, firstName, lastName, ...rest } = currentUserData;
      currentUserWithRank = {
        ...rest,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        karma: karmaPoints,
        rank: rank + 1,
      };
    }

    return { topUsers: topUsersWithRank, currentUser: currentUserWithRank };
    // END_BLOCK_ALL_TIME_LEADERBOARD
  }

  private async getPeriodicalLeaderboard(
    period: LeaderboardPeriod,
    limit: number,
    currentUserId: number,
  ): Promise<LeaderboardResponseEntity> {
    // START_BLOCK_PERIODICAL_LEADERBOARD
    const startDate = this.getStartDate(period);

    type RawLeaderboardUser = {
      id: number;
      name: string;
      avatarUrl: string | null;
      karma: number;
      rank: bigint;
    };

    const leaderboard: RawLeaderboardUser[] = await this.prisma.$queryRaw`
      WITH ranked_users AS (
        SELECT
          u.id,
          (u."first_name" || ' ' || u."last_name") as name,
          u."avatarUrl",
          SUM(kl.points)::int AS "karma",
          RANK() OVER (ORDER BY SUM(kl.points) DESC, u.id ASC) AS "rank"
        FROM "karma_logs" kl
        JOIN "users" u ON u.id = kl."userId"
        WHERE kl."createdAt" >= ${startDate}
        GROUP BY u.id
        HAVING SUM(kl.points) > 0
      )
      SELECT * FROM ranked_users
      WHERE "rank" <= ${limit} OR id = ${currentUserId}
      ORDER BY "rank" ASC;
    `;

    const formattedLeaderboard: LeaderboardUserEntity[] = leaderboard.map(
      (u) => ({ ...u, rank: Number(u.rank), name: u.name.trim() }),
    );

    const topUsers = formattedLeaderboard.filter((u) => u.rank <= limit);
    const currentUser =
      formattedLeaderboard.find((u) => u.id === currentUserId) || null;

    return { topUsers, currentUser };
    // END_BLOCK_PERIODICAL_LEADERBOARD
  }
}
