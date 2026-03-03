import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    username: string; // Coincide con "Ingrese su nombre de usuario"

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    contrasena: string; // Coincide con "Ingrese su contraseña"
}