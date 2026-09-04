// FILE: backend/src/supabase/supabase.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Create a shared Supabase JS client from env URL and anon key.
//   SCOPE: constructor client factory using ConfigService
//   DEPENDS: none
//   LINKS: M-SUPABASE, V-M-SUPABASE, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SupabaseService - env-backed SupabaseClient holder
//   client - public Supabase JS client
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

// START_CONTRACT: SupabaseService
//   PURPOSE: Hold a process-wide Supabase client for auth.getUser checks.
//   INPUTS: { configService: ConfigService - SUPABASE_URL, SUPABASE_ANON_KEY }
//   OUTPUTS: { client: SupabaseClient }
//   SIDE_EFFECTS: none beyond client construction
//   LINKS: M-SUPABASE, V-M-SUPABASE, M-AUTH
// END_CONTRACT: SupabaseService
@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    // START_BLOCK_CREATE_CLIENT
    this.client = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
    );
    // END_BLOCK_CREATE_CLIENT
  }
}
