import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '@prisma/client';

export class OrganizationEntity implements Organization {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Flag indicating if the current user is subscribed.',
  })
  isSubscribed?: boolean;
}