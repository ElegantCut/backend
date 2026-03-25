import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator'; //importa decoradores de class-validator
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PqrsTipoSolicitud {
    peticion = 'Peticion',
    queja = 'Queja',
    reclamo = 'Reclamo',
    sugerencia = 'Sugerencia'
}

export enum PqrsMedioRespuesta {
    email = 'email',
    telefono = 'telefono',
    mail = 'mail'
}

export class CrearPqrsDto {
    @ApiProperty({ description: 'ID del usuario asociado a la PQRS', example: 5 })
    @IsNumber()
    @IsNotEmpty()
    id_usuario: number;

    @ApiProperty({ description: 'Tipo de la solicitud que se está radicando', enum: PqrsTipoSolicitud, example: PqrsTipoSolicitud.queja })
    @IsEnum(PqrsTipoSolicitud, { message: 'El tipo debe ser: Peticion, Queja, Reclamo o Sugerencia' })
    @IsNotEmpty()
    tipo_solicitud: PqrsTipoSolicitud;

    //todos los que tienen  el @ son decoradores de class-validator
    @ApiProperty({ description: 'Nombre completo de quien radica la solicitud', example: 'Ana Lopez' })
    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    nombre_completo: string;

    @ApiPropertyOptional({ description: 'Documento de identidad (Opcional)', example: '10203040' })
    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    identificacion?: string;

    @ApiProperty({ description: 'Correo electrónico para recibir respuesta', example: 'ana@example.com' })
    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    email: string;

    @ApiPropertyOptional({ description: 'Teléfono de contacto (Opcional)', example: '3109876543' })
    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    telefono?: string;

    @ApiProperty({ description: 'Motivo abreviado de la solicitud', example: 'Mala atención en sucursal' })
    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    asunto: string;

    @ApiProperty({ description: 'Detalle de la solicitud que explica la petición o queja', example: 'Me atendieron 30 minutos tarde...' })
    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    descripcion: string;

    @ApiPropertyOptional({ description: 'Medio por el cual el cliente desea ser contactado', enum: PqrsMedioRespuesta, example: PqrsMedioRespuesta.email })
    @IsOptional() //valida que el dato sea opcional
    @IsEnum(PqrsMedioRespuesta) //valida que el dato sea tipo enum
    medio_respuesta?: PqrsMedioRespuesta;

    // Estos son opcionales porque al crear la PQRS suelen tener valores por defecto        
    @ApiPropertyOptional({ description: 'Estado actual del caso (ignorado al crear)', example: 'Pendiente' })
    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    estado?: string;

    @ApiPropertyOptional({ description: 'Respuesta brindada por el administrador (ignorado al crear)', example: '' })
    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    respuesta?: string;
}