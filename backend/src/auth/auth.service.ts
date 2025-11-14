import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEntity } from '../events/entities/event.entity';
import { PrismaService } from '../prisma/prisma.service';

interface SupabaseUserPayload {
  id: string;
  email?: string;
  raw_user_meta_data?: {
    name?: string;
    avatar_url?: string;
  };
}
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
  }

  calculateLevel(karmaPoints: number) {
    const levels = [
      { name: 'Новичок', threshold: 0 },
      { name: 'Активист', threshold: 101 },
      { name: 'Лидер', threshold: 501 },
      { name: 'Мастер', threshold: 1501 },
      { name: 'Амбассадор', threshold: 5001 },
    ];

    const current =
      [...levels].reverse().find((l) => karmaPoints >= l.threshold) ??
      levels[0];
    const next = levels.find((l) => karmaPoints < l.threshold);

    const progress = next
      ? (karmaPoints - current.threshold) /
        (next.threshold - current.threshold)
      : 1;

    return {
      level: current.name,
      progress: Math.min(1, Math.max(0, progress)),
      nextLevel: next?.name ?? null,
    };
  }

  async createLocalUserAfterSignUp(payload: SupabaseUserPayload) {
    if (!payload.email) {
      throw new InternalServerErrorException('Email is required');
    }

    try {
      return await this.prisma.user.create({
        data: {
          supabaseUserId: payload.id,
          email: payload.email,
          name: payload.raw_user_meta_data?.name,
          avatarUrl: payload.raw_user_meta_data?.avatar_url,
        },
      });
    } catch (error) {
      console.error('Error creating local user:', error);
      throw new InternalServerErrorException('Could not create local user.');
    }
  }

  async getUserEvents(userId: number) {
    const participations = await this.prisma.eventParticipant.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            _count: {
              select: { participants: true },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: 'asc',
        },
      },
    });

    const now = new Date();
    const upcoming: EventEntity[] = [];
    const past: EventEntity[] = [];

    for (const p of participations) {
      if (p.event.date >= now) {
        upcoming.push(p.event);
      } else {
        past.push(p.event);
      }
    }

    return { upcoming, past };
  }

  async getUserCertificates(userId: number) {
    return this.prisma.userCertificate.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }

  async getUserRewards(userId: number) {
    return this.prisma.userReward.findMany({
      where: { userId },
      include: {
        reward: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async getUserAchievements(userId: number) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });
  }
}