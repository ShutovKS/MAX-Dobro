import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ProfileEntity } from './entities/profile.entity';
import { UserAchievementEntity } from './entities/user-achievement.entity';
import { UserCertificateEntity } from './entities/user-certificate.entity';
import { UserEventsEntity } from './entities/user-events.entity';
import { UserRewardEntity } from './entities/user-reward.entity';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

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

    return {
      ...fullProfile,
      name: `${fullProfile.firstName || ''} ${fullProfile.lastName || ''}`.trim(),
      level: levelInfo.level,
      progress: levelInfo.progress,
      nextLevel: levelInfo.nextLevel,
    };
  }

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
}