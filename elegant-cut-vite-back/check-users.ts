import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.usuarios.findMany({
    select: { id_usuario: true, username: true, email: true, id_rol: true }
  })
  console.log("Users:", users)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
