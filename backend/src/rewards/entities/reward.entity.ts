import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RewardEntity {
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

  @ApiPropertyOptional({ example: 'Темы оформления' })
  category: string | null;

  @ApiPropertyOptional({
    description: 'Flag indicating if the current user has purchased this reward',
  })
  isPurchased?: boolean;
}