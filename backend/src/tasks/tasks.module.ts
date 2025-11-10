import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [AchievementsModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}