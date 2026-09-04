// FILE: backend/src/auth/entities/user-reward.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a purchased reward join row.
//   SCOPE: userId, rewardId, purchasedAt, nested reward
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UserRewardEntity - user-reward purchase with nested RewardEntity
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { UserReward } from '@prisma/client';
import { RewardEntity } from '../../rewards/entities/reward.entity';

export class UserRewardEntity implements UserReward {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    rewardId: number;

    @ApiProperty()
    purchasedAt: Date;
    
    @ApiProperty({ type: () => RewardEntity })
    reward: RewardEntity;
}
