import { ApiProperty } from '@nestjs/swagger';

export class OrganizationStatEntity {
  @ApiProperty({ example: 'total_participants' })
  id: string;

  @ApiProperty({ example: 'Всего участников' })
  label: string;

  @ApiProperty({ example: '1,234' })
  value: string;

  @ApiProperty({ example: '+15%' })
  change: string;
}