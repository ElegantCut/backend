import { PartialType } from '@nestjs/swagger';
import { CreateBarberDto } from './create.barbers.dto';

export class UpdateBarberDto extends PartialType(CreateBarberDto) {}
