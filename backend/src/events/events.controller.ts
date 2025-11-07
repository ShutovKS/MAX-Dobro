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
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard) // Защищаем роут
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: EventEntity,
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

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
  @ApiOperation({ summary: 'Get a single event by its ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'The event data.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: EventEntity,
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
  @HttpCode(204) // Стандартный код ответа для успешного удаления без тела ответа
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}