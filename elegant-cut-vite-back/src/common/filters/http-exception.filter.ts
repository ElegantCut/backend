import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch() sin argumentos indica que atrapará TODAS las excepciones no manejadas
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error('Unhandled exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Verificamos si la excepción es del tipo HttpException (como NotFound, BadRequest, etc.)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Obtenemos el mensaje original de la excepción
    let message: any = 'Error interno del servidor';
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        message = (res as any).message;
      } else {
        message = res;
      }
    }

    // Construimos una respuesta JSON unificada para que el Frontend (Flutter) siempre
    // reciba los errores con la misma estructura y pueda procesarlos fácilmente.
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      stack: exception instanceof Error ? exception.stack : String(exception)
    });
  }
}
