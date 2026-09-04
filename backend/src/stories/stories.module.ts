// FILE: backend/src/stories/stories.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires StoriesController and StoriesService with storage.
//   SCOPE: module imports and controller/provider registration
//   DEPENDS: M-SUPABASE
//   LINKS: M-STORIES, V-M-STORIES
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoriesModule - registers StoriesController and StoriesService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
// START_CONTRACT: StoriesModule
//   PURPOSE: Compose the stories Nest module graph
//   INPUTS: { SupabaseModule, StoriesController, StoriesService }
//   OUTPUTS: { StoriesModule }
//   SIDE_EFFECTS: none
//   LINKS: M-STORIES, V-M-STORIES, M-SUPABASE
// END_CONTRACT: StoriesModule
export class StoriesModule {}
