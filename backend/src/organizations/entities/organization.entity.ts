import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl?: string | null;

  @ApiProperty({ default: false })
  isVerified: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/cover.png' })
  coverImageUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://example.org' })
  websiteUrl?: string | null;

  @ApiPropertyOptional({ example: 'г. Москва, ул. Тверская, д. 1' })
  address?: string | null;

  @ApiPropertyOptional({ example: 4.5 })
  rating?: number | null;

  @ApiPropertyOptional({ example: 120 })
  reviewCount?: number;

  @ApiProperty({ description: 'Total number of subscribers' })
  subscribersCount: number;

  @ApiPropertyOptional({
    description: 'Flag indicating if the current user is subscribed.',
  })
  isSubscribed?: boolean;
  
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}