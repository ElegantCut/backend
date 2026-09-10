import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export default async () => {
  console.log('\n[Testcontainers] Apagando y destruyendo contenedor temporal...');
  
  const idFilePath = path.join(__dirname, 'test-container-id.txt');
  if (fs.existsSync(idFilePath)) {
    const containerId = fs.readFileSync(idFilePath, 'utf8');
    try {
      // Usamos docker rm -f para forzar el apagado y borrado del contenedor
      execSync(`docker rm -f ${containerId}`, { stdio: 'ignore' });
      console.log(`[Testcontainers] Contenedor destruido exitosamente.`);
    } catch (e) {
      console.log('[Testcontainers] Nota: No se pudo destruir el contenedor automáticamente.');
    }
    fs.unlinkSync(idFilePath); // Borramos el archivo de ID
  }
  
  const urlFilePath = path.join(__dirname, 'test-db-url.json');
  if (fs.existsSync(urlFilePath)) {
    fs.unlinkSync(urlFilePath); // Borramos el archivo de la URL
  }
};
