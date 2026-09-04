// FILE: backend/src/prisma/prisma.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: PrismaClient Nest wrapper with connect lifecycle and per-user session switching.
//   SCOPE: onModuleInit connect, fromUser transaction with set_current_user_id
//   DEPENDS: M-SCHEMA
//   LINKS: M-PRISMA, V-M-PRISMA, M-SCHEMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   PrismaService - PrismaClient lifecycle and RLS session helper
//   onModuleInit - connect the Prisma client
//   fromUser - run a callback inside a transaction with current user id set
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// START_CONTRACT: PrismaService
//   PURPOSE: Central database bridge and per-user session context switch.
//   INPUTS: { supabaseUserId: string, callback: (prisma) => Promise<T> for fromUser }
//   OUTPUTS: { PrismaClient methods; fromUser -> T }
//   SIDE_EFFECTS: opens DB connection; sets session user id inside transactions
//   LINKS: M-PRISMA, V-M-PRISMA, M-SCHEMA
// END_CONTRACT: PrismaService
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // START_BLOCK_FROM_USER_SESSION
  async fromUser<T>(
    supabaseUserId: string,
    callback: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT set_current_user_id(${supabaseUserId})`;
      return await callback(prisma as PrismaClient);
    });
  }
  // END_BLOCK_FROM_USER_SESSION
}
