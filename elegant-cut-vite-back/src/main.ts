import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Prefijo global para todas las rutas
  const cookieHandler = (cookieParser as any).default || cookieParser;
  app.use(
    typeof cookieHandler === 'function'
      ? cookieHandler()
      : (cookieParser as any)(),
  );

  app.setGlobalPrefix('api');

  // 2. Tuberías de validación (¡Esto está perfecto!)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 2.5 Filtro de excepciones global para que todos los errores tengan el mismo formato
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Habilitar CORS para conectar con Vite (Configuración robusta para cookies)
  app.enableCors({
    origin: true, // Permite cualquier origen que realice la petición
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
  });

  // 4. Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Elegant Cut API')
    .setDescription(
      'Documentación de la API de Elegant Cut, para reservación de barberías.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'bearer',
    ) // Nombre del esquema: 'bearer'
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Script para auto-rellenar el token en Swagger después del login
  const customJs = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const url = args[0];
        
        // Si es la ruta de login y la respuesta es exitosa
        if (typeof url === 'string' && url.includes('/auth/login') && response.ok) {
          const clone = response.clone();
          const body = await clone.json();
          
          if (body.token) {
            // Estructura que usa Swagger UI para persistir la autorización
            const authData = {
              "bearer": {
                "name": "bearer",
                "schema": {
                  "type": "http",
                  "scheme": "bearer",
                  "bearerFormat": "JWT",
                  "in": "header"
                },
                "value": body.token
              }
            };
            // Guardamos en localStorage para que Swagger lo reconozca
            localStorage.setItem('swagger-js-ui-authorized', JSON.stringify(authData));
            
            // Opcional: Recargar para que Swagger aplique el cambio visualmente
            console.log('✅ Token auto-guardado en Swagger');
            setTimeout(() => {
              window.location.reload(); 
            }, 500);
          }
        }
        return response;
      };
    })();
  `;

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJsStr: customJs,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`\n Servidor corriendo en: http://localhost:${port}/api`);
}
bootstrap();
