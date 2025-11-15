import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MaxAuthDto } from './dto/max-auth.dto';

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
  private readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

    const fullName = payload.raw_user_meta_data?.name ?? '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    try {
      return await this.prisma.user.create({
        data: {
          supabaseUserId: payload.id,
          email: payload.email,
          firstName: firstName || null,
          lastName: lastName || null,
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
            organization: {
              select: { name: true },
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
    const upcoming: any[] = [];
    const past: any[] = [];

    const mapToHistoryEvent = (participation: any) => {
      const { event, ...restParticipation } = participation;
      const { organization, durationHours, karmaPoints, ...restEvent } = event;

      return {
        ...restEvent,
        location: event.location ?? '',
        organizationName: organization.name,
        participantCount: event._count.participants,
        rewards: {
          hours: durationHours,
          karma: karmaPoints,
        },
      };
    };

    for (const p of participations) {
      const historyEvent = mapToHistoryEvent(p);
      if (p.event.date >= now) {
        upcoming.push({ ...historyEvent, status: 'upcoming' });
      } else {
        past.push({ ...historyEvent, status: 'past' });
      }
    }

    return [...upcoming, ...past.reverse()];
  }

  async getUserCourses(userId: number) {
    const [allCourses, userCertificates] = await Promise.all([
      this.prisma.course.findMany({
        include: {
          lessons: {
            include: {
              questions: {
                include: {
                  answers: {
                    select: { id: true, answer: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.userCertificate.findMany({
        where: { userId },
        select: { courseId: true },
      }),
    ]);

    const completedCourseIds = new Set(
      userCertificates.map((cert) => cert.courseId),
    );

    return allCourses.map((course) => {
      const isCompleted = completedCourseIds.has(course.id);

      const status = isCompleted ? 'completed' : 'not-started';
      const progress = isCompleted ? 1 : 0;

      const { lessons, ...courseData } = course;

      lessons.forEach((lesson) => {
        lesson.questions.forEach((question) => {
          // @ts-expect-error
          question.id = question.id.toString();
        });
      });

      return {
        ...courseData,
        hasCertificate: true,
        status,
        progress,
        program: lessons,
      };
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

  private isValidMaxHash(initData: string): boolean {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
      return false;
    }

    const dataToCheck: string[] = [];
    params.forEach((value, key) => {
      if (key !== 'hash') {
        dataToCheck.push(`${key}=${value}`);
      }
    });

    dataToCheck.sort();
    const dataCheckString = dataToCheck.join('\n');

    const botToken = this.configService.getOrThrow<string>('MAX_BOT_TOKEN');
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const hmac = crypto.createHmac('sha256', secretKey);
    const calculatedHash = hmac.update(dataCheckString).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash),
      Buffer.from(hash),
    );
  }

  async loginWithMax(dto: MaxAuthDto) {
    if (!this.isValidMaxHash(dto.initData)) {
      throw new UnauthorizedException('Invalid hash from MAX');
    }

    const params = new URLSearchParams(dto.initData);
    const userParam = params.get('user');
    if (!userParam) {
      throw new UnauthorizedException('User data is missing in initData');
    }

    const maxUserData = JSON.parse(userParam);
    const maxUserId = String(maxUserData.id);

    let user = await this.prisma.user.findUnique({ where: { maxUserId } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          maxUserId,
          email: `${maxUserId}@max-app.placeholder.com`,
          firstName: maxUserData.first_name || null,
          lastName: maxUserData.last_name || null,
          avatarUrl: maxUserData.photo_url || null,
          role: 'volunteer',
        },
      });
    }

    const payload = { sub: user.id, type: 'internal' };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
    return { accessToken };
  }
}