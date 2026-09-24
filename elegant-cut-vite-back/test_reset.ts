import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/modules/auth/auth.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const prisma = app.get(PrismaService);

  // 1. Crear un usuario de prueba si no existe
  const testEmail = 'test_reset@example.com';
  
  // Limpiar antes
  await prisma.usuarios.deleteMany({ where: { email: testEmail } });
  await prisma.codigos_verificacion.deleteMany({ where: { email: testEmail } });

  console.log('Creando usuario de prueba...');
  await prisma.usuarios.create({
    data: {
      email: testEmail,
      username: 'test_reset',
      prim_nombre: 'Test',
      apellido1: 'User',
      password_hash: 'hash123',
      id_rol: 2,
      estado: true
    }
  });

  // 2. Solicitar recuperación
  console.log('Solicitando recuperación...');
  await authService.solicitarRecuperacion(testEmail);

  // 3. Obtener el código de la BD
  const codeRow = await prisma.codigos_verificacion.findFirst({
    where: { email: testEmail },
    orderBy: { creado_en: 'desc' }
  });
  console.log('Código generado:', codeRow?.codigo);

  // 4. Intentar resetear
  if (codeRow) {
    console.log('Intentando resetear contraseña con el código...');
    try {
      const result = await authService.resetPassword({
        email: testEmail,
        codigo: codeRow.codigo,
        newPassword: 'NewPassword123'
      });
      console.log('Resultado del reset:', result);
    } catch (error) {
      console.error('Error al resetear:', error.response || error.message);
    }
  }

  await app.close();
}

bootstrap().catch(console.error);
