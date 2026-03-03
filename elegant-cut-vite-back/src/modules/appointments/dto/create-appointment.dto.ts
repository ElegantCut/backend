import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsDateString({}, { message: 'La fecha debe ser un formato válido (YYYY-MM-DD)' })
    @IsNotEmpty()
    fecha: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsNumber()
    @IsNotEmpty()
    id_usuario: number; // El cliente

    @IsNumber()
    @IsNotEmpty()
    id_empleado: number; // El barbero (que también está en la tabla usuarios)

    @IsNumber()
    @IsNotEmpty()
    id_estado_cita: number; // Ej: 1 para 'Pendiente'

    @IsNumber()
    @IsNotEmpty()
    id_horarios: number; // El bloque de tiempo elegido
}