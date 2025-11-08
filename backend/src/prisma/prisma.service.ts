import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async fromUser<T>(
    supabaseUserId: string,
    callback: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT set_current_user_id(${supabaseUserId})`;
      return await callback(prisma as PrismaClient);
    });
  }
}