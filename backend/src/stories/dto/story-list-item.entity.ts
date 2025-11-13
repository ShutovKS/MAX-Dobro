import { ApiProperty } from '@nestjs/swagger';

export class StoryListItemEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  coverImageUrl: string;
}