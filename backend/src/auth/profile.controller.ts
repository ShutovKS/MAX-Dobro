// FILE: backend/src/auth/profile.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated profile HTTP surface for the current user.
//   SCOPE: GET/PATCH /profile/me plus events, certificates, rewards, achievements, courses
//   DEPENDS: M-AUTH
//   LINKS: M-AUTH, V-M-AUTH, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ProfileController - current-user profile routes guarded by AuthGuard
//   getMe - profile with level and stats
//   updateMe - patch profile then re-read
//   getMyEvents - upcoming and past events
//   getMyCertificates - completed course certificates
//   getMyRewards - purchased rewards
//   getMyAchievements - unlocked achievements
//   getMyCourses - courses with progress
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { UserAchievementEntity } from './entities/user-achievement.entity';
import { UserCertificateEntity } from './entities/user-certificate.entity';
import { UserCourseEntity } from './entities/user-course.entity';
import { UserEventsEntity } from './entities/user-events.entity';
import { UserRewardEntity } from './entities/user-reward.entity';
import { AuthGuard } from './guards/auth.guard';

// START_CONTRACT: ProfileController
//   PURPOSE: Serve and update the authenticated user's profile collections.
//   INPUTS: { authService: AuthService, CurrentUser: User }
//   OUTPUTS: { profile, events, certificates, rewards, achievements, courses }
//   SIDE_EFFECTS: updateMe persists profile fields
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: ProfileController
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  // START_BLOCK_GET_AND_UPDATE_ME
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with achievements' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user data with statistics & achievements.',
    type: ProfileEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getMe(@CurrentUser() user: User): Promise<any> {
    const fullProfile = await this.authService.getProfile(user.id);

    if (!fullProfile) {
      throw new NotFoundException('User profile could not be found.');
    }
    const levelInfo = this.authService.calculateLevel(fullProfile.karmaPoints);

    const stats = [
      { id: '1', value: String(fullProfile.totalHours), label: 'Часы' },
      { id: '2', value: String(fullProfile.karmaPoints), label: 'Карма' },
    ];

    return {
      ...fullProfile,
      name: `${fullProfile.firstName || ''} ${fullProfile.lastName || ''}`.trim(),
      level: levelInfo.level,
      progress: levelInfo.progress,
      nextLevel: levelInfo.nextLevel,
      stats,
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: ProfileEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateMe(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<any> {
    await this.authService.updateProfile(user.id, dto);
    return this.getMe(user);
  }
  // END_BLOCK_GET_AND_UPDATE_ME

  // START_BLOCK_PROFILE_COLLECTIONS
  @Get('me/events')
  @ApiOperation({ summary: "Get current user's events" })
  @ApiResponse({
    status: 200,
    description: 'Returns upcoming and past events for the current user.',
    type: UserEventsEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMyEvents(@CurrentUser() user: User) {
    return this.authService.getUserEvents(user.id);
  }

  @Get('me/certificates')
  @ApiOperation({ summary: "Get current user's certificates" })
  @ApiResponse({ status: 200, type: [UserCertificateEntity] })
  getMyCertificates(@CurrentUser() user: User) {
    return this.authService.getUserCertificates(user.id);
  }

  @Get('me/rewards')
  @ApiOperation({ summary: "Get current user's purchased rewards" })
  @ApiResponse({ status: 200, type: [UserRewardEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMyRewards(@CurrentUser() user: User) {
    return this.authService.getUserRewards(user.id);
  }

  @Get('me/achievements')
  @ApiOperation({ summary: "Get current user's unlocked achievements" })
  @ApiResponse({ status: 200, type: [UserAchievementEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMyAchievements(@CurrentUser() user: User) {
    return this.authService.getUserAchievements(user.id);
  }

  @Get('me/courses')
  @ApiOperation({ summary: "Get current user's courses with progress" })
  @ApiResponse({
    status: 200,
    description: "A list of user's courses with their completion status.",
    type: [UserCourseEntity],
  })
  getMyCourses(@CurrentUser() user: User) {
    return this.authService.getUserCourses(user.id);
  }
  // END_BLOCK_PROFILE_COLLECTIONS
}
