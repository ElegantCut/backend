import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
    @ApiProperty({ description: 'Fecha de la cita en formato YYYY-MM-DD', example: '2023-12-05' })
    @IsDateString({}, { message: 'La fecha debe ser un formato válido (YYYY-MM-DD)' })
    @IsNotEmpty()
    fecha: string;

    @ApiPropertyOptional({ description: 'Notas adicionales sobre la cita', example: 'Por favor, puntuales.' })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({ description: 'ID del usuario (cliente) que reserva', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id_usuario: number; // El cliente

    @ApiProperty({ description: 'ID del barbero asignado a la cita', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    id_empleado: number; // El barbero (que también está en la tabla usuarios)

    @ApiProperty({ description: 'Estado inicial de la cita. 1 = Pendiente', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id_estado_cita: number; // Ej: 1 para 'Pendiente'

    @ApiProperty({ description: 'ID del bloque horario seleccionado', example: 3 })
    @IsNumber()
    @IsNotEmpty()
    id_horarios: number; // El bloque de tiempo elegido

    @ApiProperty({ description: 'ID del servicio seleccionado', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id_servicio: number; // El servicio (corte, barba, etc.)
}