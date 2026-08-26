const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const reservaData = {
    fecha: new Date("2026-08-25"),
    id_empleado: 13
  };
  const fechaDate = new Date(reservaData.fecha);
  const nextDay = new Date(fechaDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const existingAppointments = await prisma.reservas.findMany({
    where: {
      id_empleado: reservaData.id_empleado,
      fecha: { gte: fechaDate, lt: nextDay },
      id_estado_cita: { in: [1, 2] },
    },
    select: {
      id_reservas: true,
      fecha: true,
      horarios: { select: { hora_inicio: true } },
    },
  });
  console.log(existingAppointments);
}
main().catch(console.error).finally(() => prisma.$disconnect());
