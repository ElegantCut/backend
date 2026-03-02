import { IsString, IsNotEmpty, IsNumber, IsPositive, Matches } from 'class-validator';

export class CrearServicioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
    nombre: string;

    @IsNumber()
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    precio: number;

    /**
     * Duración del servicio en minutos.
     * Ejemplo: 40 para un servicio que dura 40 minutos.
     */
    @IsNumber()
    @IsPositive({ message: 'La duración debe ser un número positivo (ejemplo: 40)' })
    duracion: number;
}