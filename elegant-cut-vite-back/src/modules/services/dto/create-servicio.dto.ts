import { IsString, IsNotEmpty, IsNumber, IsPositive, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearServicioDto {
    @ApiProperty({ description: 'Nombre del servicio a ofrecer', example: 'Corte de Cabello' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
    nombre: string;

    @ApiProperty({ description: 'Precio base del servicio', example: 15000 })
    @IsNumber()
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    precio: number;

    /**
     * Duración del servicio en minutos.
     * Ejemplo: 40 para un servicio que dura 40 minutos.
     */
    @ApiProperty({ description: 'Duración estimada en minutos', example: 45 })
    @IsNumber()
    @IsPositive({ message: 'La duración debe ser un número positivo (ejemplo: 40)' })
    duracion: number;
}