//Este archivo es el DTO, es que  se encarga de validar los datos que se reciben en el metodo post
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'; //importa decoradores de class-validator

export enum PqrsTipoSolicitud {
    peticion = 'peticion',
    queja = 'queja',
    reclamo = 'reclamo',
    sugerencia = 'sugerencia'
}

export enum PqrsMedioRespuesta {
    email = 'email',
    telefono = 'telefono',
    mail = 'mail'
}

export class CrearPqrsDto {
    @IsEnum(PqrsTipoSolicitud, { message: 'El tipo debe ser: peticion, queja, reclamo o sugerencia' })
    @IsNotEmpty()
    tipo_solicitud: PqrsTipoSolicitud;

    //todos los que tienen  el @ son decoradores de class-validator
    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    nombre_completo: string;

    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    identificacion?: string;

    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    email: string;

    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    telefono?: string;

    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    asunto: string;

    @IsString() //valida que el dato sea tipo texto
    @IsNotEmpty() //valida que el dato no sea vacio
    descripcion: string;

    @IsOptional() //valida que el dato sea opcional
    @IsEnum(PqrsMedioRespuesta) //valida que el dato sea tipo enum
    medio_respuesta?: PqrsMedioRespuesta;

    // Estos son opcionales porque al crear la PQRS suelen tener valores por defecto        
    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    estado?: string;

    @IsOptional() //valida que el dato sea opcional
    @IsString() //valida que el dato sea tipo texto
    respuesta?: string;
}