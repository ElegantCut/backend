const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newReview = await prisma.resenas.create({
    data: {
      nombre_cliente: "Test Agent",
      email_cliente: "test@agent.com",
      calificacion: 5,
      comentario: "Este es un comentario de prueba desde el script para verificar visibilidad.",
      estado: 1
    }
  });
  console.log('Review creada:', newReview);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
