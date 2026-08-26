const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const times = [];
  // mañana
  times.push(900, 930, 1000, 1030, 1100, 1130);
  // tarde
  times.push(1230, 1300, 1330, 1400, 1430, 1500, 1530, 1600, 1630, 1700, 1730);
  // noche
  times.push(1800, 1830, 1900, 1930, 2000);

  for (const t of times) {
    let hora_fin = t + 30;
    if (hora_fin % 100 === 60) {
      hora_fin += 40; // e.g. 960 -> 1000
    }
    
    // check if exists
    const existing = await prisma.horarios.findFirst({ where: { hora_inicio: t } });
    if (!existing) {
      await prisma.horarios.create({
        data: {
          hora_inicio: t,
          hora_fin: hora_fin
        }
      });
      console.log(`Created ${t}`);
    } else {
      console.log(`Exists ${t}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
