import { MySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export default async () => {
  console.log('\n[Testcontainers] Iniciando contenedor MySQL temporal...');
  
  // Arrancar contenedor MySQL versión 8
  const container = await new MySqlContainer('mysql:8.0')
    .withDatabase('elegant_cut_test')
    .withRootPassword('testroot')
    .start();

  const host = container.getHost();
  const port = container.getPort();
  const dbName = container.getDatabase();
  const username = container.getUsername();
  const password = container.getUserPassword();

  const databaseUrl = `mysql://${username}:${password}@${host}:${port}/${dbName}`;
  console.log(`[Testcontainers] MySQL corriendo en ${host}:${port}`);

  // Guardamos la URL generada dinámicamente en un archivo JSON para que Jest la lea
  const envFilePath = path.join(__dirname, 'test-db-url.json');
  fs.writeFileSync(envFilePath, JSON.stringify({ DATABASE_URL: databaseUrl }));

  // Guardamos el ID del contenedor para poder apagarlo en el teardown
  const idFilePath = path.join(__dirname, 'test-container-id.txt');
  fs.writeFileSync(idFilePath, container.getId());

  console.log('[Testcontainers] Ejecutando migraciones de Prisma en el contenedor...');
  
  // Forzamos a Prisma a empujar el esquema al contenedor recién creado
  execSync('npx prisma db push --skip-generate', {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
    stdio: 'inherit',
  });
  
  console.log('[Testcontainers] Base de datos temporal lista para las pruebas.');
};
