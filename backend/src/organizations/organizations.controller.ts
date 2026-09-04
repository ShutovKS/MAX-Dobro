// FILE: backend/src/organizations/organizations.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST organizations catalog, subscriptions, and organizer dashboard routes.
//   SCOPE: list/get orgs, reviews, subscribe, dashboard stats, organizer events and participants
//   DEPENDS: M-AUTH, M-EVENTS, M-REVIEWS
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationsController - REST organizations and organizer routes
//   findAll - GET /organizations
//   findOne - GET /organizations/:id
//   getReviews - GET /organizations/:id/reviews
//   updateSubscription - POST /organizations/:id/subscription
//   getDashboardStats - GET /organization/dashboard/stats
//   findOrganizationEvents - GET /organization/events
//   getEventParticipants - GET /organization/events/:eventId/participants
//   getOrganizationDetails - GET /organization/details
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { EventsService } from '../events/events.service';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationStatEntity } from './entities/organization-stat.entity';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller()
// START_CONTRACT: OrganizationsController
//   PURPOSE: HTTP adapter for org catalog, subscriptions, and organizer dashboard
//   INPUTS: { OrganizationsService, ReviewsService, EventsService, User, PaginationQueryDto }
//   OUTPUTS: { OrganizationEntity, OrganizationStatEntity, ReviewEntity[] }
//   SIDE_EFFECTS: none beyond delegated service calls
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-AUTH, M-EVENTS, M-REVIEWS
// END_CONTRACT: OrganizationsController
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly reviewsService: ReviewsService,
    private readonly eventsService: EventsService,
  ) {}

  // START_BLOCK_QUERY_ORGS
  @Get('organizations')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of organizations' })
  @ApiResponse({ type: [OrganizationEntity] })
  findAll(
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user?: User,
  ) {
    return this.organizationsService.findAll(pagination, user?.id);
  }

  @Get('organizations/:id')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single organization by ID' })
  @ApiResponse({ type: OrganizationEntity })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: User) {
    return this.organizationsService.findOne(id, user?.id);
  }

  @Get('organizations/:id/reviews')
  @ApiOperation({ summary: "Get an organization's reviews" })
  @ApiResponse({ status: 200, type: [ReviewEntity] })
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.reviewsService.findAllForOrganization(id, pagination);
  }
  // END_BLOCK_QUERY_ORGS

  // START_BLOCK_MUTATE_SUBSCRIPTION
  @Post('organizations/:id/subscription')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update subscription status for an organization' })
  updateSubscription(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() body: { isSubscribed: boolean },
  ) {
    return this.organizationsService.updateSubscription(
      id,
      user.id,
      body.isSubscribed,
    );
  }
  // END_BLOCK_MUTATE_SUBSCRIPTION

  // START_BLOCK_ORGANIZER_DASHBOARD
  @Get('organization/dashboard/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics for an organization' })
  @ApiResponse({ type: [OrganizationStatEntity] })
  getDashboardStats(@CurrentUser() user: User) {
    const organizationId = user.organizationId ?? 1;
    return this.organizationsService.getDashboardStats(organizationId);
  }

  @Get('organization/events')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get organization's events (for organizer)" })
  findOrganizationEvents(@CurrentUser() user: User) {
    const organizationId = user.organizationId ?? 1;
    return this.organizationsService.findEventsForOrganizer(organizationId);
  }

  @Get('organization/events/:eventId/participants')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event participants (for organizer)' })
  getEventParticipants(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventsService.getParticipants(eventId);
  }

  @Get('organization/details')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get organization's details (for organizer)" })
  getOrganizationDetails(@CurrentUser() user: User) {
    const organizationId = user.organizationId ?? 1;
    return this.organizationsService.findOne(organizationId, user.id);
  }
  // END_BLOCK_ORGANIZER_DASHBOARD
}
