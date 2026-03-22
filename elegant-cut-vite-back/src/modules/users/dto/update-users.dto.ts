import { PartialType } from '@nestjs/swagger';
import { CrearUsuarioDto } from './create-users.dto';

export class UpdateUsuarioDto extends PartialType(CrearUsuarioDto) {}
