// FILE: backend/test/test-utils.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Shared e2e helpers for resetting the test database.
//   SCOPE: Truncate application tables with identity restart and cascade
//   DEPENDS: M-PRISMA, M-SCHEMA
//   LINKS: V-M-PRISMA
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   clearDatabase - truncate all application tables between e2e cases
//   tableNames - ordered list of Prisma table names to truncate
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { PrismaClient } from '@prisma/client';

// START_CONTRACT: clearDatabase
//   PURPOSE: Truncate application tables so each e2e case starts empty
//   INPUTS: { prisma: PrismaClient - connected test-database client }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: TRUNCATE TABLE ... RESTART IDENTITY CASCADE on listed tables
//   LINKS: V-M-PRISMA
// END_CONTRACT: clearDatabase
export const clearDatabase = async (prisma: PrismaClient) => {
  // START_BLOCK_TRUNCATE_TABLES
  const tableNames = [
    'friendships',
    'user_challenges',
    'challenges',
    'story_likes',
    'comments',
    'user_rewards',
    'user_certificates',
    'user_achievements',
    'event_participants',
    'user_organization_subscriptions',
    'stories',
    'karma_logs',
    'event_chat_messages',
    'event_chats',
    'chat_messages',
    'events',
    'rewards',
    'achievements',
    'quiz_answers',
    'quiz_questions',
    'lessons',
    'courses',
    'organizations',
    'users',
  ];

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  }
  // END_BLOCK_TRUNCATE_TABLES
};
