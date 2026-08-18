const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const now = new Date();
        const cotNow = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  
        const cotStart = new Date(cotNow);
        cotStart.setUTCHours(0, 0, 0, 0);
  
        const today = new Date(cotStart.getTime() + 5 * 60 * 60 * 1000);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
        console.log('Today:', today);
        console.log('Tomorrow:', tomorrow);
  
        const [
          citasHoyCount,
          citasPendientesCount,
          citasCompletadasCount,
          citasCanceladasCount,
          clientesNuevosCount,
          reservasCompletadasHoy,
        ] = await Promise.all([
          prisma.reservas.count({
            where: { fecha: { gte: today, lt: tomorrow } },
          }),
          prisma.reservas.count({ where: { id_estado_cita: 1 } }),
          prisma.reservas.count({ where: { id_estado_cita: 2 } }),
          prisma.reservas.count({ where: { id_estado_cita: 3 } }),
          prisma.usuarios.count({
            where: { id_rol: 2, created_at: { gte: today, lt: tomorrow } },
          }),
          prisma.reservas.findMany({
            where: {
              fecha: { gte: today, lt: tomorrow },
              id_estado_cita: 2, // 2 = Completada
            },
            include: {
              detalle_cita_servicio: {
                include: {
                  servicios: true,
                },
              },
            },
          }),
        ]);
        
        console.log('citasHoyCount:', citasHoyCount);
        console.log('citasPendientesCount:', citasPendientesCount);
        
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
