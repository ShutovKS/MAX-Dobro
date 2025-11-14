import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FriendsService } from './friends.service';

@ApiTags('Friends')
@Controller('friends')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: "Get current user's friends" })
  getFriends(@CurrentUser() user: User) {
    return this.friendsService.findFriends(user.id);
  }
}