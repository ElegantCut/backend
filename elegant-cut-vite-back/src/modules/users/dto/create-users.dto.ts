import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsDate,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearUsuarioDto {
  @ApiProperty({
    description: 'Nombre de usuario único para el login',
    example: 'juan123',
  })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Primer nombre del usuario', example: 'Juan' })
  @IsString()
  prim_nombre: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del usuario (opcional)',
    example: 'Carlos',
  })
  @IsOptional()
  @IsString()
  seg_nombre?: string;

  @ApiProperty({ description: 'Primer apellido del usuario', example: 'Pérez' })
  @IsString()
  apellido1: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario (opcional)',
    example: 'Gómez',
  })
  @IsOptional()
  @IsString()
  apellido2?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña en texto plano (será encriptada por el backend)',
    example: 'MiPasswordSeguro123',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password_hash: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '3001234567',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Estado de la cuenta. true=Activo, false=Inactivo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiPropertyOptional({
    default: 2,
  })

  //decorador del rol que faltaba para que lo añada
  @IsOptional()


  @IsNumber()
  id_rol?: number;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil (generalmente desde Cloudinary)',
    example: 'https://res.cloudinary.com/mi-cloud/image/upload/v1234/foto.jpg',
  })
  @IsOptional()
  @IsString()
  foto_perfil?: string;
}
