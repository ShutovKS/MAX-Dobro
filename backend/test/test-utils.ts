import { PrismaClient } from '@prisma/client';

export const clearDatabase = async (prisma: PrismaClient) => {
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
};