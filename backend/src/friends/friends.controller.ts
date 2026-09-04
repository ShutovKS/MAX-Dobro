// FILE: backend/src/friends/friends.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for the current user's friend list.
//   SCOPE: GET /friends
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-FRIENDS, V-M-FRIENDS, class-FriendsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   FriendsController - current-user friendship listing
//   getFriends - return public friend rows for the caller
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FriendsService } from './friends.service';

// START_CONTRACT: FriendsController
//   PURPOSE: Expose authenticated friends HTTP route
//   INPUTS: { user: User }
//   OUTPUTS: { PublicUser[] }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-FRIENDS, V-M-FRIENDS, fn-getFriends
// END_CONTRACT: FriendsController
@ApiTags('Friends')
@Controller('friends')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // START_CONTRACT: getFriends
  //   PURPOSE: Return the current user's friends
  //   INPUTS: { user: User }
  //   OUTPUTS: { Promise<PublicUser[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-FRIENDS, BLOCK_LIST_FRIENDS
  // END_CONTRACT: getFriends
  @Get()
  @ApiOperation({ summary: "Get current user's friends" })
  getFriends(@CurrentUser() user: User) {
    return this.friendsService.findFriends(user.id);
  }
}
