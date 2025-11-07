import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // <-- Добавь этот импорт
import { SupabaseModule } from '../supabase/supabase.module'; // <-- И этот
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule, SupabaseModule], // <-- Добавь модули сюда
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}