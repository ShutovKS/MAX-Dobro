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

@Module({
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
})
export class AppModule {}