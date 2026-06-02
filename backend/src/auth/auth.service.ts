import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MaxAuthDto } from './dto/max-auth.dto';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>(
      'JWT_INTERNAL_SECRET',
    );
  }

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
      return await this.prisma.user.upsert({
        where: { supabaseUserId: payload.id },
        update: {
          email: payload.email,
        },
        create: {
          supabaseUserId: payload.id,
          email: payload.email,
          firstName: firstName || null,
          lastName: lastName || null,
          avatarUrl: payload.raw_user_meta_data?.avatar_url,
        },
      });
    } catch (error) {
      console.error('Error in upsert local user via Supabase:', error);
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return this.prisma.user.update({
          where: { email: payload.email },
          data: { supabaseUserId: payload.id },
        });
      }
      throw new InternalServerErrorException(
        'Could not create or update local user.',
      );
    }
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(dto.about !== undefined ? { about: dto.about } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      },
    });
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
      const { event } = participation;
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
    const [allAchievements, userAchievements, user] =
      await this.prisma.$transaction([
        this.prisma.achievement.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.userAchievement.findMany({
          where: { userId },
          select: { achievementId: true, unlockedAt: true },
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          include: {
            participations: { where: { event: { status: 'COMPLETED' } } },
            subscriptions: true,
            certificates: true,
          },
        }),
      ]);

    if (!user) {
      throw new InternalServerErrorException('User not found for achievements');
    }

    const unlockedIds = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]),
    );

    return allAchievements.map((ach) => {
      const isUnlocked = unlockedIds.has(ach.id);
      let progress: number | undefined;
      let cta: string | undefined;

      if (!isUnlocked) {
        switch (ach.criteriaType) {
          case 'EVENT_COUNT':
            progress = user.participations.length;
            cta = 'Найти событие';
            break;
          case 'TOTAL_HOURS':
            progress = user.totalHours;
            cta = 'Найти событие';
            break;
          case 'KARMA_POINTS':
            progress = user.karmaPoints;
            cta = 'Заработать карму';
            break;
          case 'COURSES_COUNT':
            progress = user.certificates.length;
            cta = 'Перейти к курсам';
            break;
          case 'SUBSCRIPTION_COUNT':
            progress = user.subscriptions.length;
            cta = 'Найти организацию';
            break;
          case 'EVENT_CATEGORY':
            cta = 'Найти событие';
            progress = 0;
            break;
          default:
            progress = undefined;
            cta = 'К цели!';
        }
      }

      return {
        ...ach,
        unlocked: isUnlocked,
        unlockedDate:
          unlockedIds.get(ach.id)?.toLocaleDateString('ru-RU') || null,
        progress: progress,
        target: ach.criteriaValue,
        cta: isUnlocked ? 'Поделиться' : cta,
      };
    });
  }

  /**
   * Проверяет подпись `initData` от WebApp (Telegram/MAX используют один алгоритм:
   * HMAC-SHA256 с секретным ключом, полученным из `WebAppData` и токена бота).
   */
  private verifyWebAppInitData(initData: string, botToken: string): boolean {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
      return false;
    }
    const dataToCheck: string[] = [];
    params.forEach((value, key) => {
      // Исключаем И `hash`, И `signature`. Современные Telegram-клиенты
      // добавляют поле `signature` (Ed25519, для сторонней валидации) рядом
      // с `hash`; в data-check-string для HMAC оно НЕ входит. Если его не
      // исключить, подпись не сойдётся и вход вернёт 401 на новых клиентах.
      if (key !== 'hash' && key !== 'signature') {
        dataToCheck.push(`${key}=${value}`);
      }
    });
    dataToCheck.sort();
    const dataCheckString = dataToCheck.join('\n');
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const hmac = crypto.createHmac('sha256', secretKey);
    const calculatedHash = hmac.update(dataCheckString).digest('hex');
    if (calculatedHash.length !== hash.length) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash),
      Buffer.from(hash),
    );
  }

  private isValidMaxHash(initData: string): boolean {
    const botToken = this.configService.getOrThrow<string>('MAX_BOT_TOKEN');
    return this.verifyWebAppInitData(initData, botToken);
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
    const user = await this.prisma.user.upsert({
      where: { maxUserId },
      update: {
        firstName: maxUserData.first_name || null,
        lastName: maxUserData.last_name || null,
        avatarUrl: maxUserData.photo_url || null,
      },
      create: {
        maxUserId,
        email: `${maxUserId}@max-app.placeholder.com`,
        firstName: maxUserData.first_name || null,
        lastName: maxUserData.last_name || null,
        avatarUrl: maxUserData.photo_url || null,
        role: 'volunteer',
      },
    });
    const payload = { sub: user.id, type: 'internal' };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
    return { accessToken };
  }

  async loginWithTelegram(dto: TelegramAuthDto) {
    const botToken =
      this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    if (!this.verifyWebAppInitData(dto.initData, botToken)) {
      throw new UnauthorizedException('Invalid hash from Telegram');
    }
    const params = new URLSearchParams(dto.initData);
    const userParam = params.get('user');
    if (!userParam) {
      throw new UnauthorizedException('User data is missing in initData');
    }
    const tgUserData = JSON.parse(userParam);
    const telegramUserId = String(tgUserData.id);
    const user = await this.prisma.user.upsert({
      where: { telegramUserId },
      update: {
        firstName: tgUserData.first_name || null,
        lastName: tgUserData.last_name || null,
        avatarUrl: tgUserData.photo_url || null,
      },
      create: {
        telegramUserId,
        email: `${telegramUserId}@telegram.placeholder.com`,
        firstName: tgUserData.first_name || null,
        lastName: tgUserData.last_name || null,
        avatarUrl: tgUserData.photo_url || null,
        role: 'volunteer',
      },
    });
    const payload = { sub: user.id, type: 'internal' };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
    return { accessToken };
  }

  async loginAsDemoOrganizer() {
    const demoOrganizerEmail = 'organizer@test.com';
    const user = await this.prisma.user.findUnique({
      where: { email: demoOrganizerEmail },
    });

    if (!user || user.role !== 'organization') {
      throw new NotFoundException(
        'Demo organizer user not found. Please seed the database.',
      );
    }

    const payload = { sub: user.id, type: 'internal' };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
    return { accessToken };
  }
}