import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
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

  @ApiPropertyOptional({ example: 'Экология' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Возраст 18+, удобная одежда' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ example: 55.751244 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: 37.618423 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Часы добра, начисляемые волонтёру', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationHours?: number;

  @ApiPropertyOptional({ description: 'Очки кармы за участие', example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  karmaPoints?: number;

  @ApiPropertyOptional({ description: 'Курс, сертификат которого выдаётся по завершении', example: 1 })
  @IsOptional()
  @IsInt()
  recommendedCourseId?: number;

  // organizationId не принимаем от клиента — берём из авторизованного организатора.
}