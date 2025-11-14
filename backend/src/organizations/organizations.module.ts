import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [SupabaseModule, ReviewsModule, EventsModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}