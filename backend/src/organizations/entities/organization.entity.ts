// FILE: backend/src/organizations/entities/organization.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for an organization catalog card.
//   SCOPE: identity, copy, media, rating, subscriber count, isSubscribed
//   DEPENDS: none
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationEntity - OpenAPI organization with optional viewer subscription flag
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  fullDescription: string | null

  @ApiPropertyOptional({ nullable: true })
  category: string | null;

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
  subscribers: number;

  @ApiPropertyOptional({
    description: 'Flag indicating if the current user is subscribed.',
  })
  isSubscribed?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
