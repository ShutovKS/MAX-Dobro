// FILE: backend/src/learning/learning.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST /courses boundary for catalog, quiz scoring, and lesson completion.
//   SCOPE: list/get courses, complete quiz, mark lesson complete
//   DEPENDS: M-AUTH
//   LINKS: M-LEARNING, V-M-LEARNING, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LearningController - REST /courses
//   findAll - GET /courses
//   findOne - GET /courses/:id
//   completeCourse - POST /courses/:id/complete
//   markLessonComplete - POST /courses/:id/lessons/:lessonId/complete
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
// START_CONTRACT: LearningController
//   PURPOSE: HTTP adapter for courses, quiz scoring, and lesson progress
//   INPUTS: { LearningService, CompleteCourseDto, User }
//   OUTPUTS: { CourseEntity, quiz score, lesson progress }
//   SIDE_EFFECTS: none beyond LearningService calls
//   LINKS: M-LEARNING, V-M-LEARNING, M-AUTH
// END_CONTRACT: LearningController
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  // START_BLOCK_QUERY_COURSES
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
  // END_BLOCK_QUERY_COURSES

  // START_BLOCK_COMPLETE_COURSE
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
  // END_BLOCK_COMPLETE_COURSE

  // START_BLOCK_COMPLETE_LESSON
  @Post(':id/lessons/:lessonId/complete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a lesson complete; issues certificate when all lessons done' })
  @ApiResponse({ status: 201, description: 'Lesson marked complete' })
  markLessonComplete(
    @Param('id', ParseIntPipe) id: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: User,
  ) {
    return this.learningService.markLessonComplete(user.id, id, lessonId);
  }
  // END_BLOCK_COMPLETE_LESSON
}
