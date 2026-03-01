import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber, IsDate } from 'class-validator';

export class CrearUsuarioDto {
    @IsString()
    username: string;

    @IsString()
    prim_nombre: string;

    @IsOptional()
    @IsString()
    seg_nombre?: string;

    @IsString()
    apellido1: string;

    @IsOptional()
    @IsString()
    apellido2?: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString()
    password_hash: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsBoolean()
    estado: boolean;

    @IsNumber()
    id_rol: number;

    @IsOptional()
    @IsString()
    foto_perfil?: string;
}
