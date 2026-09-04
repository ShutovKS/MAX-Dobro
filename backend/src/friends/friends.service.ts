// FILE: backend/src/friends/friends.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Return the current user's friend list.
//   SCOPE: Query Friendship rows and map public friend profiles
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-FRIENDS, V-M-FRIENDS, class-FriendsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   FriendsService - friendship listing
//   findFriends - map related users for one userId
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// START_CONTRACT: FriendsService
//   PURPOSE: Load public friend profiles for a user
//   INPUTS: { userId: number }
//   OUTPUTS: { Promise<PublicUser[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRIENDS, V-M-FRIENDS, M-PRISMA, BLOCK_LIST_FRIENDS
// END_CONTRACT: FriendsService
@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: findFriends
  //   PURPOSE: Query friendships and map public user rows
  //   INPUTS: { userId: number }
  //   OUTPUTS: { Promise<{ id: number, name: string, avatarUrl: string | null }[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-FRIENDS, V-M-FRIENDS, BLOCK_LIST_FRIENDS
  // END_CONTRACT: findFriends
  async findFriends(userId: number) {
    // START_BLOCK_LIST_FRIENDS
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      select: {
        friend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return friendships.map((f) => {
      const { firstName, lastName, ...rest } = f.friend;
      return {
        ...rest,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
      };
    });
    // END_BLOCK_LIST_FRIENDS
  }
}
