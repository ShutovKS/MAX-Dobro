// FILE: backend/src/supabase/supabase.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest module that provides and exports the Supabase client wrapper.
//   SCOPE: ConfigModule import, SupabaseService provider and export
//   DEPENDS: M-SUPABASE
//   LINKS: M-SUPABASE, V-M-SUPABASE, M-AUTH
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SupabaseModule - ConfigModule plus SupabaseService barrel
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

// START_CONTRACT: SupabaseModule
//   PURPOSE: Register SupabaseService for auth token verification paths.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - imports, providers, exports }
//   SIDE_EFFECTS: none
//   LINKS: M-SUPABASE, V-M-SUPABASE
// END_CONTRACT: SupabaseModule
@Module({
  // START_BLOCK_SUPABASE_PROVIDERS
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
  // END_BLOCK_SUPABASE_PROVIDERS
})
export class SupabaseModule {}
