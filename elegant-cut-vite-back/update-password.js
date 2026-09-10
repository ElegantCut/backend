const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);

  const user = await prisma.usuarios.update({
    where: { id_usuario: 17 }, // admin user
    data: { password_hash: hashedPassword }
  });

  console.log("Updated user password for:", user.username);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
