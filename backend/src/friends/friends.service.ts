import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriends(userId: number) {
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      select: {
        friend: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return friendships.map((f) => f.friend);
  }
}