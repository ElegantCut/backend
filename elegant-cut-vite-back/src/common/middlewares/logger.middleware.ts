import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Inicializamos un logger con el contexto 'HTTP' para diferenciar los logs
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // Interceptamos el evento 'finish' de la respuesta (cuando ya se envió al cliente)
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      // Imprimimos el log en la consola del servidor
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${contentLength}b - ${userAgent}`,
      );
    });

    // next() indica que la petición debe continuar su camino hacia el controlador
    next();
  }
}
