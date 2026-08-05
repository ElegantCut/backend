const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const data = await prisma.reservas.findMany({
        where: { id_usuario: 1 },
        include: {
            horarios: true,
            estado_cita: true,
            detalle_cita_servicio: {
                include: { servicios: true }
            }
        }
    });
    console.log(JSON.stringify(data, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
