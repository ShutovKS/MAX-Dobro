// FILE: backend/src/challenges/challenges.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires weekly-challenge HTTP and query providers.
//   SCOPE: Import SupabaseModule; register ChallengesController and ChallengesService
//   DEPENDS: M-PRISMA, M-AUTH, M-SUPABASE
//   LINKS: M-CHALLENGES, V-M-CHALLENGES
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ChallengesModule - registers challenges controller and service
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
