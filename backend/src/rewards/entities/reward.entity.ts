import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Reward } from '@prisma/client';

export class RewardEntity
  implements Omit<Reward, 'title' | 'cost' | 'icon'>
{
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'Фирменная футболка' })
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({ example: 'tshirt-icon' })
  imageUrl: string | null;

  @ApiProperty({ description: 'Cost in karma points' })
  price: number;

  @ApiProperty({ example: 'Темы оформления' })
  category: string;

  @ApiPropertyOptional({
    description: 'Flag indicating if the current user has purchased this reward',
  })
  isPurchased?: boolean;
}