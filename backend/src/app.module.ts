// FILE: backend/src/app.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Root Nest module that wires config, scheduling, and all feature modules.
//   SCOPE: global ConfigModule, ScheduleModule, feature imports, AppController, AppService
//   DEPENDS: M-AUTH, M-USERS, M-PRISMA, M-SUPABASE, M-WEBHOOKS, M-TASKS
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP, M-BACKEND-BOOTSTRAP
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AppModule - root barrel for auth, users, events, prisma, supabase, webhooks, tasks, and remaining features
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AchievementsModule } from './achievements/achievements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssistantChatModule } from './assistant-chat/assistant-chat.module';
import { EventsModule } from './events/events.module';
import { LearningModule } from './learning/learning.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RewardsModule } from './rewards/rewards.module';
import { StoriesModule } from './stories/stories.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { EventChatsModule } from './event-chats/event-chats.module';
import { FriendsModule } from './friends/friends.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MapModule } from './map/map.module';
import { ReviewsModule } from './reviews/reviews.module';

// START_CONTRACT: AppModule
//   PURPOSE: Compose backend feature modules and the root health controller.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - imports, controllers, providers }
//   SIDE_EFFECTS: none
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
// END_CONTRACT: AppModule
@Module({
  // START_BLOCK_FEATURE_IMPORTS
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    EventsModule,
    PrismaModule,
    SupabaseModule,
    WebhooksModule,
    TasksModule,
    AchievementsModule,
    LearningModule,
    OrganizationsModule,
    RewardsModule,
    StoriesModule,
    AssistantChatModule,
    LeaderboardModule,
    EventChatsModule,
    FriendsModule,
    ChallengesModule,
    MapModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  // END_BLOCK_FEATURE_IMPORTS
})
export class AppModule {}
