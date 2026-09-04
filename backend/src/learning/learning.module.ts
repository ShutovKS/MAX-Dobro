// FILE: backend/src/learning/learning.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires LearningController and LearningService with auth and storage.
//   SCOPE: module imports and controller/provider registration
//   DEPENDS: M-AUTH, M-SUPABASE
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LearningModule - registers LearningController and LearningService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

@Module({
  imports: [
    AuthModule,
    SupabaseModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
})
// START_CONTRACT: LearningModule
//   PURPOSE: Compose the learning Nest module graph
//   INPUTS: { AuthModule, SupabaseModule, LearningController, LearningService }
//   OUTPUTS: { LearningModule }
//   SIDE_EFFECTS: none
//   LINKS: M-LEARNING, V-M-LEARNING, M-AUTH
// END_CONTRACT: LearningModule
export class LearningModule {}
