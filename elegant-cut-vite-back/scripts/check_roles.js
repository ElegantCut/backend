const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.rol.findMany()
  .then(r => { console.log(JSON.stringify(r)); return p.$disconnect(); })
  .catch(e => { console.error('ERROR:', e.message); return p.$disconnect(); });
