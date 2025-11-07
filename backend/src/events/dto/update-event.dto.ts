import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

// PartialType(CreateEventDto) создает новый класс,
// в котором все поля из CreateEventDto становятся опциональными.
export class UpdateEventDto extends PartialType(CreateEventDto) {}