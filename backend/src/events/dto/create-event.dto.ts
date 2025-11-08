import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional, // <-- Импортируй IsOptional
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

  // --- Начало изменений ---
  @ApiPropertyOptional({ example: 'Парк Горького, центральный вход' })
  @IsOptional()
  @IsString()
  @IsNotEmpty() // Убедимся, что если поле передано, то оно не пустое
  location?: string;
  // --- Конец изменений ---

  @ApiPropertyOptional({
    description: 'Maximum number of participants. If null, unlimited.',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @IsPositive() // Участников не может быть 0 или меньше
  maxParticipants?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  organizationId: number;
}