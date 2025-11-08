import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '../../events/entities/event.entity';

export class UserEventsEntity {
    
    @ApiProperty({ type: [EventEntity] })
    upcoming: EventEntity[];

    @ApiProperty({ type: [EventEntity] })
    past: EventEntity[];
}