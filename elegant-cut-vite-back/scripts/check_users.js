const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.usuarios.findMany({ select: { id_usuario: true, username: true, prim_nombre: true, id_rol: true, estado: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); return p.$disconnect(); })
  .catch(e => { console.error('ERROR:', e.message); return p.$disconnect(); });
