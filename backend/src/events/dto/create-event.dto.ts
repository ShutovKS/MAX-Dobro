import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Субботник в парке' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Убираем листья и сажаем деревья.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Парк Горького, центральный вход' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants. If null, unlimited.',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxParticipants?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  organizationId: number;
}