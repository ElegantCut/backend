const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Revisando estados de cita...");
  const estados = [
    { id: 1, conf: true },  // Pendiente
    { id: 2, conf: true },  // Completada
    { id: 3, conf: false }  // Cancelada
  ];

  for (const estado of estados) {
    try {
      await prisma.estado_cita.upsert({
        where: { id_estado_cita: estado.id },
        update: {},
        create: { id_estado_cita: estado.id, confirmada: estado.conf }
      });
      console.log(`Estado ${estado.id} verificado/creado.`);
    } catch (e) {
      console.error(`Error con estado ${estado.id}:`, e.message);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Proceso finalizado.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
