import {
  Controller,
  Delete,
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
import { User } from '@prisma/client';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations.',
    type: [OrganizationEntity],
  })
  findAll(
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user?: User,
  ) {
    return this.organizationsService.findAll(pagination, user?.id);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single organization by ID' })
  @ApiResponse({ status: 200, type: OrganizationEntity })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: User) {
    return this.organizationsService.findOne(id, user?.id);
  }

  @Post(':id/subscribe')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Subscribe to an organization' })
  @ApiResponse({ status: 204, description: 'Successfully subscribed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  @ApiResponse({ status: 409, description: 'Already subscribed.' })
  subscribe(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.organizationsService.subscribe(id, user.id);
  }

  @Delete(':id/unsubscribe')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unsubscribe from an organization' })
  @ApiResponse({ status: 204, description: 'Successfully unsubscribed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  unsubscribe(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.organizationsService.unsubscribe(id, user.id);
  }
}