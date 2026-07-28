/**
 * Script para re-hashear contraseñas que están en texto plano en la BD.
 * Ejecutar con: node fix-passwords.cjs
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.usuarios.findMany({
        select: { id_usuario: true, username: true, password_hash: true }
    });

    console.log(`Total de usuarios: ${users.length}`);
    let fixed = 0;

    for (const user of users) {
        const hash = user.password_hash;
        // Si no empieza con $2a$ o $2b$, es texto plano
        const isPlainText = !hash || (!hash.startsWith('$2a$') && !hash.startsWith('$2b$'));

        if (isPlainText) {
            const newHash = await bcrypt.hash(hash || 'Cambiar1234!', 10);
            await prisma.usuarios.update({
                where: { id_usuario: user.id_usuario },
                data: { password_hash: newHash }
            });
            console.log(`✅ Hasheado: ${user.username} (contraseña original: "${hash}")`);
            fixed++;
        }
    }

    console.log(`\n✅ Listo. ${fixed} contraseñas actualizadas.`);
    console.log(`ℹ️  Los usuarios con contraseñas en texto plano ahora usan su contraseña original para iniciar sesión.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
