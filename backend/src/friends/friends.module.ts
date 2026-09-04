// FILE: backend/src/friends/friends.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires friends HTTP and listing providers.
//   SCOPE: Import SupabaseModule; register FriendsController and FriendsService
//   DEPENDS: M-PRISMA, M-AUTH, M-SUPABASE
//   LINKS: M-FRIENDS, V-M-FRIENDS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   FriendsModule - registers friends controller and service
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [SupabaseModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
