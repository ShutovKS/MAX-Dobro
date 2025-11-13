import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateStoryDto } from './dto/create-story.dto';
import { FullStoryEntity } from './dto/full-story.entity';
import { StoryListItemEntity } from './dto/story-list-item.entity';
import { StoriesService } from './stories.service';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new story (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The story has been successfully created.',
    type: FullStoryEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(createStoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all stories (preview)' })
  @ApiResponse({
    status: 200,
    description: 'A list of stories with titles and covers.',
    type: [StoryListItemEntity],
  })
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single story by its ID (full content)' })
  @ApiResponse({
    status: 200,
    description: 'The full story data.',
    type: FullStoryEntity,
  })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storiesService.findOne(id);
  }
}