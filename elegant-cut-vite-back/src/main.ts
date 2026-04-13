import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Prefijo global para todas las rutas
  const cookieHandler = (cookieParser as any).default || cookieParser;
  app.use(typeof cookieHandler === 'function' ? cookieHandler() : (cookieParser as any)());

  app.setGlobalPrefix('api');

  // 2. Tuberías de validación (¡Esto está perfecto!)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Habilitar CORS para conectar con Vite (Configuración robusta para cookies)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  });

  // 4. Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Elegant Cut API')
    .setDescription('Documentación de la API de Elegant Cut, para reservación de barberías.')
    .setVersion('1.0')
    .addBearerAuth() // Soporte para JWT Token en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantener el token aunque se recargue la página
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`\n Servidor corriendo en: http://localhost:${port}/api`);
}
bootstrap();