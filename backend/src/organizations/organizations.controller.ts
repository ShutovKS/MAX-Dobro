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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly reviewsService: ReviewsService,
    private readonly eventsService: EventsService,
  ) {}

  @Get('organizations')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of organizations' })
  @ApiResponse({ type: [OrganizationEntity] })
  findAll(@Query() pagination: PaginationQueryDto, @CurrentUser() user?: User) {
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
    return this.organizationsService.updateSubscription(id, user.id, body.isSubscribed);
  }
  
  @Get('organization/dashboard/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics for an organization' })
  @ApiResponse({ type: [OrganizationStatEntity] })
  getDashboardStats(@CurrentUser() user: User) {
    // ЗАГЛУШКА: нужна логика для получения ID организации из текущего юзера
    const organizationId = 1; 
    return this.organizationsService.getDashboardStats(organizationId);
  }
  
  @Get('organization/events')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get organization's events (for organizer)" })
  findOrganizationEvents(@CurrentUser() user: User) {
    // ЗАГЛУШКА: нужна логика для получения ID организации из текущего юзера
    const organizationId = 1;
    return this.organizationsService.findEventsForOrganizer(organizationId);
  }

  @Get('organization/events/:eventId/participants')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get event participants (for organizer)" })
  getEventParticipants(@Param('eventId', ParseIntPipe) eventId: number) {
    // ЗАГЛУШКА: нужна проверка, что событие принадлежит организации юзера
    return this.eventsService.getParticipants(eventId);
  }
  
  @Get('organization/details')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get organization's details (for organizer)" })
  getOrganizationDetails(@CurrentUser() user: User) {
    // ЗАГЛУШКА: нужна логика для получения ID организации из текущего юзера
    const organizationId = 1;
    return this.organizationsService.findOne(organizationId, user.id);
  }
}