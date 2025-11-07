import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Тип для данных, приходящих от Supabase (например, через webhook)
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

  // Этот метод будет вызываться (например, вебхуком),
  // когда в Supabase Auth создается новый пользователь.
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
      // Обработка возможных ошибок, например, если пользователь уже существует
      console.error('Error creating local user:', error);
      throw new InternalServerErrorException('Could not create local user.');
    }
  }
}