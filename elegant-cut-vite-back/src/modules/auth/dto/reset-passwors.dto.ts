// src/modules/auth/dto/reset-password.dto.ts
import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string; // El correo al que se envió el código

  @IsString()
  @Length(6, 6)
  codigo: string; // El código de 6 dígitos que recibió por correo

  @IsString()
  @Length(8, 20)
  newPassword: string; // La nueva contraseña que quiere crear
}
