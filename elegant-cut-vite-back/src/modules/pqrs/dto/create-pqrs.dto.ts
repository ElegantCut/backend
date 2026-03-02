import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    nombre_completo: string;

    @IsOptional()
    @IsString()
    identificacion?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsString()
    @IsNotEmpty()
    asunto: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    @IsEnum(PqrsMedioRespuesta)
    medio_respuesta?: PqrsMedioRespuesta;

    // Estos son opcionales porque al crear la PQRS suelen tener valores por defecto
    @IsOptional()
    @IsString()
    estado?: string;

    @IsOptional()
    @IsString()
    respuesta?: string;
}