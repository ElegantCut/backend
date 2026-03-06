import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsOptional,
    IsNumber,
    IsArray,
    MaxLength,
    Min,
    Max
} from 'class-validator';

export class CreatePortaDto {
    @IsInt()
    @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
    id_usuario: number;

    @IsString()
    @IsOptional()
    biografia?: string; // Es TEXT en SQL

    @IsString()
    @IsOptional()
    @MaxLength(100) // Coincide con VARCHAR(100)
    experiencia?: string;

    @IsArray() // Es JSON en SQL, lo recibimos como Array
    @IsOptional()
    especialidades?: string[];

    @IsNumber({ maxDecimalPlaces: 1 }) // Coincide con DECIMAL(2,1)
    @IsOptional()
    @Min(0)
    @Max(9.9)
    calificacion?: number;

    @IsInt()
    @IsOptional()
    reseñas_count?: number; // Ajustado con 'ñ' para match exacto con SQL

    @IsString()
    @IsOptional()
    @MaxLength(100) // Coincide con VARCHAR(100)
    instagram?: string;

    @IsArray() // Es JSON en SQL, lo recibimos como Array
    @IsOptional()
    fotos_portafolio?: string[];
}