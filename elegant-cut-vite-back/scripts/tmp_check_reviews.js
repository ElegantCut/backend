const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.resenas.findMany({
    include: {
      barbero: true
    }
  });
  console.log('Total reviews:', reviews.length);
  console.log(JSON.stringify(reviews, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
