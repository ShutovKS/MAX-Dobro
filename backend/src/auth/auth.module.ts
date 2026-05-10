import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileController } from './profile.controller';

@Module({
  /** <context:backend_auth_module> Auth boundary for Supabase-backed and internal-token requests. </context:backend_auth_module> */
  imports: [SupabaseModule], // ConfigModule и JwtModule здесь больше не нужны
  controllers: [ProfileController, AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
