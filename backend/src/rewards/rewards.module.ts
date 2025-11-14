import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [SupabaseModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}