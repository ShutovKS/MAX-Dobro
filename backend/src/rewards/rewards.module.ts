// FILE: backend/src/rewards/rewards.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires RewardsController and RewardsService with storage.
//   SCOPE: module imports and controller/provider registration
//   DEPENDS: M-SUPABASE
//   LINKS: M-REWARDS, V-M-REWARDS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   RewardsModule - registers RewardsController and RewardsService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [SupabaseModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
// START_CONTRACT: RewardsModule
//   PURPOSE: Compose the rewards Nest module graph
//   INPUTS: { SupabaseModule, RewardsController, RewardsService }
//   OUTPUTS: { RewardsModule }
//   SIDE_EFFECTS: none
//   LINKS: M-REWARDS, V-M-REWARDS, M-SUPABASE
// END_CONTRACT: RewardsModule
export class RewardsModule {}
