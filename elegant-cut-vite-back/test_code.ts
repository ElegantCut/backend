import { PrismaClient, codigos_verificacion_tipo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const codigo = '123456';
  const tipo = codigos_verificacion_tipo.recuperacion;

  const fechaExpiracion = new Date();
  fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

  console.log('Creando codigo de verificacion...');
  console.log('fechaExpiracion JS:', fechaExpiracion.toISOString());

  const created = await prisma.codigos_verificacion.create({
    data: {
      email,
      codigo,
      tipo,
      expira_en: fechaExpiracion,
      usado: false,
    },
  });

  console.log('Creado:', created);

  console.log('Buscando con gte: new Date()...');
  const found = await prisma.codigos_verificacion.findFirst({
    where: {
      email,
      codigo,
      tipo,
      usado: false,
      expira_en: { gte: new Date() },
    },
  });

  console.log('Encontrado:', found);

  await prisma.codigos_verificacion.delete({ where: { id: created.id } });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
