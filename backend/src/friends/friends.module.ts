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