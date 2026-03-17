import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'El nombre de usuario del administrador, cliente o barbero',
        example: 'juanperez123'
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    username: string; // Coincide con "Ingrese su nombre de usuario"

    @ApiProperty({
        description: 'La contraseña de la cuenta',
        example: 'MiPasswordSeguro123'
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    contrasena: string; // Coincide con "Ingrese su contraseña"
}