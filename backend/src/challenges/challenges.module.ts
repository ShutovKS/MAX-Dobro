import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}