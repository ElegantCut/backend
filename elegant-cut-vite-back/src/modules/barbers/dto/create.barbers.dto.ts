import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBarberDto {
  @ApiProperty({ description: 'Primer nombre del barbero', example: 'Pedro' })
  @IsString()
  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  prim_nombre: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del barbero',
    example: 'Antonio',
  })
  @IsString()
  @IsOptional()
  seg_nombre?: string;

  @ApiProperty({
    description: 'Primer apellido del barbero',
    example: 'Martínez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  apellido1: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del barbero',
    example: 'Gómez',
  })
  @IsString()
  @IsOptional()
  apellido2?: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'pedro.barber@elegantcut.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'pedromtz',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Contraseña del barbero',
    example: 'Secreta123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password_hash: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '3201234567',
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Biografía para el portafolio del barbero',
  })
  @IsString()
  @IsOptional()
  biografia?: string;

  @ApiPropertyOptional({ description: 'Experiencia del barbero' })
  @IsString()
  @IsOptional()
  experiencia?: string;

  @ApiPropertyOptional({
    description: 'Especialidades del barbero, e.g. ["Corte Clasico", "Barba"]',
  })
  @IsString()
  @IsOptional()
  especialidades?: string;
}
