// FILE: backend/src/leaderboard/leaderboard.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires leaderboard HTTP and ranking providers.
//   SCOPE: Import SupabaseModule; register LeaderboardController and LeaderboardService
//   DEPENDS: M-PRISMA, M-AUTH, M-SUPABASE
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardModule - registers leaderboard controller and service
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
