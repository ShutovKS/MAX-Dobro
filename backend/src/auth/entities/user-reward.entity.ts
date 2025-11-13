import { ApiProperty } from '@nestjs/swagger';
import { UserReward } from '@prisma/client';
import { RewardEntity } from '../../rewards/dto/reward.entity';

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