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
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CompleteCourseDto } from './dto/complete-course.dto';
import { CourseEntity } from './entities/course.entity';
import { LearningService } from './learning.service';

@ApiTags('Learning')
@Controller('courses')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all courses' })
  @ApiResponse({ status: 200, type: [CourseEntity] })
  findAll() {
    return this.learningService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course with lessons and questions' })
  @ApiResponse({ status: 200, type: CourseEntity })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.learningService.findOne(id);
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete a course by submitting quiz answers' })
  @ApiResponse({ status: 201, description: 'Course completed successfully' })
  @ApiResponse({ status: 400, description: 'Quiz failed' })
  @ApiResponse({ status: 409, description: 'Course already completed' })
  completeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() completionDto: CompleteCourseDto,
  ) {
    return this.learningService.completeCourse(user.id, id, completionDto);
  }
}