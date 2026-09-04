// FILE: backend/src/events/events.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST /events boundary for event CRUD and participation.
//   SCOPE: create, list, get, update, delete events; participate, cancel, list and patch participants
//   DEPENDS: M-AUTH
//   LINKS: M-EVENTS, V-M-EVENTS, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventsController - REST /events routes
//   create - POST /events as organizer
//   findAll - GET /events paginated
//   findOne - GET /events/:id with optional auth
//   getParticipants - GET /events/:id/participants
//   update - PATCH /events/:id
//   remove - DELETE /events/:id
//   participate - POST /events/:id/participate
//   cancelParticipation - DELETE /events/:id/participate
//   updateParticipantStatus - PATCH /events/:eventId/participants/:userId
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { PublicUserEntity } from '../users/entities/public-user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventParticipantEntity } from './entities/event-participant.entity';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
// START_CONTRACT: EventsController
//   PURPOSE: HTTP adapter for event queries and participation
//   INPUTS: { EventsService, CreateEventDto, UpdateEventDto, PaginationQueryDto, User }
//   OUTPUTS: { EventEntity, EventParticipantEntity, PublicUserEntity[] }
//   SIDE_EFFECTS: none beyond EventsService calls
//   LINKS: M-EVENTS, V-M-EVENTS, M-AUTH
// END_CONTRACT: EventsController
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // START_BLOCK_MUTATE_CREATE
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: () => EventEntity,
  })
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    // organizationId берём из авторизованного организатора; пока мультиорг вне
    // scope — фолбэк на единственную организацию (1), чтобы не ломать демо.
    return this.eventsService.create(createEventDto, user.organizationId ?? 1);
  }
  // END_BLOCK_MUTATE_CREATE

  // START_BLOCK_QUERY_EVENTS
  @Get()
  @ApiOperation({ summary: 'Get a list of all events with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of events.',
    type: [EventEntity],
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.eventsService.findAll(paginationQuery);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single event by its ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'The event data.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: User) {
    return this.eventsService.findOne(id, user?.id);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get a list of event participants' })
  @ApiResponse({
    status: 200,
    description: "List of event's participants.",
    type: [() => PublicUserEntity],
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getParticipants(id);
  }
  // END_BLOCK_QUERY_EVENTS

  // START_BLOCK_MUTATE_EVENTS
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: () => EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
  // END_BLOCK_MUTATE_EVENTS

  // START_BLOCK_PARTICIPATE
  @Post(':id/participate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Participate in an event' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered for the event.',
    type: () => EventParticipantEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already participating in this event.',
  })
  participate(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.participate(eventId, user.id);
  }

  @Delete(':id/participate')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel participation in an event' })
  @ApiResponse({
    status: 204,
    description: 'Successfully canceled participation.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Participation record not found.' })
  cancelParticipation(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.cancelParticipation(eventId, user.id);
  }

  @Patch(':eventId/participants/:userId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update participant status (organization admin only)',
  })
  updateParticipantStatus(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { status: string },
  ) {
    return this.eventsService.updateParticipantStatus(
      eventId,
      userId,
      body.status,
    );
  }
  // END_BLOCK_PARTICIPATE
}
