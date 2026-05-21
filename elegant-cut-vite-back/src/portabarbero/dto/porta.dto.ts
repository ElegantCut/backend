import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsArray,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortaDto {
  @ApiProperty({
    description: 'ID del usuario barbero asociado al portafolio',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
  id_usuario: number;

  @ApiPropertyOptional({
    description: 'Breve biografía del barbero',
    example: 'Apasionado por los cortes clásicos.',
  })
  @IsString()
  @IsOptional()
  biografia?: string; // Es TEXT en SQL

  @ApiPropertyOptional({
    description: 'Años o detalle de su experiencia',
    example: '5 años de exp',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100) // Coincide con VARCHAR(100)
  experiencia?: string;

  @ApiPropertyOptional({
    description: 'Lista de especialidades del barbero',
    example: ['Fade', 'Perfilado de Barba', 'Colorimetría'],
  })
  @IsArray() // Es JSON en SQL, lo recibimos como Array
  @IsOptional()
  especialidades?: string[];

  @ApiPropertyOptional({
    description: 'Usuario o link a Instagram del barbero',
    example: '@barber_elegant',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100) // Coincide con VARCHAR(100)
  instagram?: string;

  @ApiPropertyOptional({
    description: 'URLs de las fotos de sus mejores cortes',
    example: ['https://url.com/foto1.jpg'],
  })
  @IsArray() // Es JSON en SQL, lo recibimos como Array
  @IsOptional()
  fotos_portafolio?: string[];
}
