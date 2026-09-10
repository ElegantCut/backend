import * as fs from 'fs';
import * as path from 'path';

// Este archivo se ejecuta justo antes de cada suite de pruebas.
// Leemos la URL temporal generada por global-setup.ts
const envFilePath = path.join(__dirname, 'test-db-url.json');

if (fs.existsSync(envFilePath)) {
  const dbData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
  
  // Inyectamos la URL en process.env para que PrismaService se conecte al contenedor
  if (dbData.DATABASE_URL) {
    process.env.DATABASE_URL = dbData.DATABASE_URL;
  }
}
