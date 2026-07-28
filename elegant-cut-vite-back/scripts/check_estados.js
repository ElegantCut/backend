const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // El frontend espera: 1=Pendiente, 2=Completada, 3=Cancelada
  // Insertamos el 3 si no existe. (Y nos aseguramos de que no de error)
  // Nota: id_estado_cita no tiene autoincrement configurable manualmente si ya está, pero asumiendo
  // que podemos crear el 3 o 4 directamente.
  try {
      await prisma.estado_cita.create({
          data: { id_estado_cita: 3, confirmada: false }
      });
      console.log("Creado estado 3");
  } catch(e) { console.log("Estado 3 ya existe o error", e.message); }
  
  const estados = await prisma.estado_cita.findMany();
  console.log("=== ESTADOS ACTUALIZADOS ===");
  console.log(estados);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
