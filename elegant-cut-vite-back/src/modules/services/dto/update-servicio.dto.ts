import { PartialType } from '@nestjs/swagger';
import { CrearServicioDto } from './create-servicio.dto';

export class UpdateServicioDto extends PartialType(CrearServicioDto) {}
