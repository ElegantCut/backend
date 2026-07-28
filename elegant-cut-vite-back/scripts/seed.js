const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    // 1. Insertar Roles
    console.log('Insertando roles...');
    const roles = [
      { id_rol: 1, nombre_rol: 'Administrador' },
      { id_rol: 2, nombre_rol: 'Cliente' },
      { id_rol: 3, nombre_rol: 'Barbero' },
    ];
    
    for (const rol of roles) {
      await prisma.rol.upsert({
        where: { id_rol: rol.id_rol },
        update: { nombre_rol: rol.nombre_rol },
        create: rol,
      });
    }
    console.log('✅ Roles insertados: Administrador(1), Cliente(2), Barbero(3)');

    // 2. Hash de contraseña
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    // 3. Insertar Admin
    console.log('Insertando admin...');
    await prisma.usuarios.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        prim_nombre: 'Super',
        apellido1: 'Admin',
        email: 'admin@elegantcut.com',
        password_hash: passwordHash,
        telefono: '3001234567',
        estado: true,
        id_rol: 1,
      },
    });
    console.log('✅ Admin creado (user: admin, pass: Admin123!)');

    // 4. Insertar Barberos
    console.log('Insertando barberos...');
    const barberos = [
      { username: 'carlos_barbero', prim_nombre: 'Carlos', seg_nombre: 'Andrés', apellido1: 'Martínez', apellido2: 'López', email: 'carlos@elegantcut.com', telefono: '3109876543', bio: 'Barbero profesional con pasión por los cortes clásicos y modernos', exp: '5 años', esp: 'Cortes clásicos, Fade, Pompadour', cal: 4.8 },
      { username: 'miguel_barbero', prim_nombre: 'Miguel', seg_nombre: 'Ángel', apellido1: 'Rodríguez', apellido2: 'Gómez', email: 'miguel@elegantcut.com', telefono: '3201234567', bio: 'Especialista en degradados y diseños artísticos', exp: '3 años', esp: 'Degradados, Diseños, Colorimetría', cal: 4.5 },
      { username: 'juan_barbero', prim_nombre: 'Juan', seg_nombre: 'Pablo', apellido1: 'García', apellido2: 'Torres', email: 'juan@elegantcut.com', telefono: '3157654321', bio: 'Experto en barbería tradicional y cuidado de barba', exp: '7 años', esp: 'Barba, Afeitado clásico, Corte tijera', cal: 4.9 },
    ];

    for (const b of barberos) {
      const barberoPass = await bcrypt.hash('Barbero123!', 10);
      const user = await prisma.usuarios.upsert({
        where: { username: b.username },
        update: {},
        create: {
          username: b.username,
          prim_nombre: b.prim_nombre,
          seg_nombre: b.seg_nombre,
          apellido1: b.apellido1,
          apellido2: b.apellido2,
          email: b.email,
          password_hash: barberoPass,
          telefono: b.telefono,
          estado: true,
          id_rol: 3,
        },
      });

      // Crear portafolio
      const existingPortafolio = await prisma.portafolios.findFirst({ where: { id_usuario: user.id_usuario } });
      if (!existingPortafolio) {
        await prisma.portafolios.create({
          data: {
            id_usuario: user.id_usuario,
            biografia: b.bio,
            experiencia: b.exp,
            especialidades: b.esp,
          },
        });
      }
      console.log(`✅ Barbero creado: ${b.username} (pass: Barbero123!)`);
    }

    // 5. Insertar Clientes
    console.log('Insertando clientes...');
    const clientes = [
      { username: 'pedro_cliente', prim_nombre: 'Pedro', apellido1: 'Sánchez', apellido2: 'Ruiz', email: 'pedro@email.com', telefono: '3001112233' },
      { username: 'maria_cliente', prim_nombre: 'María', seg_nombre: 'Fernanda', apellido1: 'López', apellido2: 'Castro', email: 'maria@email.com', telefono: '3004445566' },
    ];

    for (const c of clientes) {
      const clientePass = await bcrypt.hash('Cliente123!', 10);
      await prisma.usuarios.upsert({
        where: { username: c.username },
        update: {},
        create: {
          username: c.username,
          prim_nombre: c.prim_nombre,
          seg_nombre: c.seg_nombre || null,
          apellido1: c.apellido1,
          apellido2: c.apellido2,
          email: c.email,
          password_hash: clientePass,
          telefono: c.telefono,
          estado: true,
          id_rol: 2,
        },
      });
      console.log(`✅ Cliente creado: ${c.username} (pass: Cliente123!)`);
    }

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Resumen de credenciales:');
    console.log('  Admin:    admin / Admin123!');
    console.log('  Barbero:  carlos_barbero / Barbero123!');
    console.log('  Barbero:  miguel_barbero / Barbero123!');
    console.log('  Barbero:  juan_barbero / Barbero123!');
    console.log('  Cliente:  pedro_cliente / Cliente123!');
    console.log('  Cliente:  maria_cliente / Cliente123!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
