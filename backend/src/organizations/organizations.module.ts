// FILE: backend/src/organizations/organizations.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires OrganizationsController/Service with reviews, events, and storage.
//   SCOPE: module imports and controller/provider registration
//   DEPENDS: M-SUPABASE, M-REVIEWS, M-EVENTS
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationsModule - registers OrganizationsController and OrganizationsService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
// START_CONTRACT: OrganizationsModule
//   PURPOSE: Compose the organizations Nest module graph
//   INPUTS: { SupabaseModule, ReviewsModule, EventsModule, OrganizationsController, OrganizationsService }
//   OUTPUTS: { OrganizationsModule }
//   SIDE_EFFECTS: none
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-EVENTS, M-REVIEWS
// END_CONTRACT: OrganizationsModule
export class OrganizationsModule {}
