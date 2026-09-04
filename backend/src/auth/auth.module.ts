// FILE: backend/src/auth/auth.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest auth barrel for login, profile, and guard providers.
//   SCOPE: SupabaseModule import, AuthController, ProfileController, AuthService, AuthGuard
//   DEPENDS: M-SUPABASE
//   LINKS: M-AUTH, V-M-AUTH, M-SUPABASE
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AuthModule - auth and profile controllers plus AuthService and AuthGuard
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileController } from './profile.controller';

// START_CONTRACT: AuthModule
//   PURPOSE: Wire auth HTTP surface for Supabase-backed and internal-token requests.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - imports, controllers, providers, exports }
//   SIDE_EFFECTS: none
//   LINKS: M-AUTH, V-M-AUTH, M-SUPABASE
// END_CONTRACT: AuthModule
@Module({
  // START_BLOCK_AUTH_PROVIDERS
  imports: [SupabaseModule], // ConfigModule и JwtModule здесь больше не нужны
  controllers: [ProfileController, AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
  // END_BLOCK_AUTH_PROVIDERS
})
export class AuthModule {}
