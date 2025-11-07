import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [SupabaseModule], // PrismaModule глобальный, его не нужно импортировать
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}