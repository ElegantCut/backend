
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const barbers = await prisma.usuarios.findMany({
      where: { id_rol: 3 },
      include: {
        portafolios: true,
        resenas_recibidas: {
          where: { estado: 1 },
          select: { calificacion: true }
        }
      }
    });

    console.log('Total barbers found:', barbers.length);
    barbers.forEach(b => {
      const resenas = b.resenas_recibidas || [];
      console.log(`Barber ${b.id_usuario} (${b.prim_nombre}): ${resenas.length} reviews, foto_perfil: "${b.foto_perfil}"`);
      if (resenas.length > 0) {
        console.log('Reviews sample:', resenas);
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
