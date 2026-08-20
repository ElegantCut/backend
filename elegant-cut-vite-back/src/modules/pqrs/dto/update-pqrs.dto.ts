import { PartialType } from '@nestjs/swagger';
import { CrearPqrsDto } from './create-pqrs.dto';

export class UpdatePqrsDto extends PartialType(CrearPqrsDto) {}
