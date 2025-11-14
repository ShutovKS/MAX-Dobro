import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}