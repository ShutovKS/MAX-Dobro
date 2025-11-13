import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEntity } from '../events/entities/event.entity';
import { PrismaService } from '../prisma/prisma.service';

interface SupabaseUserPayload {
  id: string;
  email?: string;
  raw_user_meta_data?: {
    name?: string;
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

  calculateLevel(karmaPoints: number): string {
    if (karmaPoints <= 100) return 'Новичок';
    if (karmaPoints <= 500) return 'Активист';
    if (karmaPoints <= 1500) return 'Лидер';
    if (karmaPoints <= 5000) return 'Мастер';
    return 'Амбассадор';
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
        },
      });
    } catch (error) {
      console.error('Error creating local user:', error);
      throw new InternalServerErrorException('Could not create local user.');
    }
  }

  async getUserEvents(userId: number, supabaseUserId: string) {
    return this.prisma.fromUser(supabaseUserId, async (prisma) => {
      const participations = await prisma.eventParticipant.findMany({
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
    });
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
}