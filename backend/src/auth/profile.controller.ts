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
import { UserEventsEntity } from './entities/user-events.entity';
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
  async getMe(@CurrentUser() user: User): Promise<ProfileEntity> {
    const fullProfile = await this.authService.getProfile(user.id);

    if (!fullProfile) {
      throw new NotFoundException('User profile could not be found.');
    }
    const levelName = this.authService.calculateLevel(fullProfile.karmaPoints);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { supabaseUserId, ...profileData } = fullProfile;

    return { ...profileData, levelName };
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
    return this.authService.getUserEvents(user.id, user.supabaseUserId);
  }
}