import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileController } from './profile.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [ProfileController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}