// FILE: backend/src/rewards/entities/reward.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a karma-shop reward with optional purchase flag.
//   SCOPE: id, name, description, imageUrl, price, category, isPurchased
//   DEPENDS: none
//   LINKS: M-REWARDS, V-M-REWARDS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   RewardEntity - OpenAPI reward with optional isPurchased for the current user
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
