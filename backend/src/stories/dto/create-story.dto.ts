import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({ example: 'Новая глава в истории добра' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/new-cover.jpg' })
  @IsUrl()
  @IsNotEmpty()
  coverImageUrl: string;

  @ApiProperty({ example: '<h1>Подробное описание</h1><p>...</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;
}