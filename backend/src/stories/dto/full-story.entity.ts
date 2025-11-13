import { ApiProperty } from '@nestjs/swagger';
import { Story } from '@prisma/client';

export class FullStoryEntity implements Story {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  coverImageUrl: string;

  @ApiProperty({ description: 'Full story content, can contain HTML or Markdown' })
  content: string;

  @ApiProperty()
  createdAt: Date;
}