const fs = require('fs');
const path = require('path');

const dir = 'test/pruebas integracion';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.e2e-spec.ts'));

const cleanupBlock = `    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.pagos.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.resenas.deleteMany();
    await prisma.barberos_servicios.deleteMany();
    await prisma.portafolios.deleteMany();
    await prisma.pqrs.deleteMany();
    await prisma.notificaciones.deleteMany();
    await prisma.codigos_verificacion.deleteMany();
    await prisma.cola_correos.deleteMany();
    await prisma.usuarios.deleteMany();`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any contiguous block of prisma deleteMany calls with the robust block
  const regex = /(?:[ \t]*await prisma\.[a-zA-Z_]+\.deleteMany\(\);\r?\n)+/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, cleanupBlock + '\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', file);
  }
});
