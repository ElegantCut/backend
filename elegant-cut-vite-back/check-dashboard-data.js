const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('UTC today range:', today.toISOString(), 'to', tomorrow.toISOString());

    // 1. Get all reservations for today
    const reservations = await prisma.reservas.findMany({
      where: { fecha: { gte: today, lt: tomorrow } },
      include: {
        detalle_cita_servicio: {
          include: {
            servicios: true
          }
        }
      }
    });

    console.log('Total reservations for today:', reservations.length);
    reservations.forEach(r => {
      console.log(`- Res #${r.id_reservas}: Date: ${r.fecha.toISOString()} | Status: ${r.id_estado_cita} | Services Count: ${r.detalle_cita_servicio.length}`);
      r.detalle_cita_servicio.forEach(d => {
        console.log(`  * Service: ${d.servicios?.nombre} | Price: ${d.servicios?.precio}`);
      });
    });

    // 2. Calculate today's completed appointments stats
    const citasCompletadasHoy = reservations.filter(r => r.id_estado_cita === 2);
    console.log('\nCompleted reservations today:', citasCompletadasHoy.length);

    const ingresosHoy = citasCompletadasHoy.reduce((total, reserva) => {
      const precioServicios = reserva.detalle_cita_servicio.reduce((subTotal, detalle) => {
        return subTotal + (detalle.servicios ? Number(detalle.servicios.precio) : 0);
      }, 0);
      return total + precioServicios;
    }, 0);

    console.log('Calculated ingresosHoy:', ingresosHoy);

    // 3. Let's see all reservations in the system to understand the dates
    const allReservations = await prisma.reservas.findMany({
      take: 10,
      orderBy: { fecha: 'desc' },
      include: {
        detalle_cita_servicio: {
          include: {
            servicios: true
          }
        }
      }
    });
    console.log('\nLast 10 reservations in system:');
    allReservations.forEach(r => {
      console.log(`- Res #${r.id_reservas}: Date: ${r.fecha.toISOString()} | Status: ${r.id_estado_cita} | Services Count: ${r.detalle_cita_servicio.length}`);
      r.detalle_cita_servicio.forEach(d => {
        console.log(`  * Service: ${d.servicios?.nombre} | Price: ${d.servicios?.precio}`);
      });
    });

  } catch (error) {
    console.error('Error running stats check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
