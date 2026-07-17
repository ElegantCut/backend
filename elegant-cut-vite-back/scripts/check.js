const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== USUARIOS EN LA BD ===");
    const users = await prisma.usuarios.findMany({
        select: {
            id_usuario: true,
            username: true,
            email: true,
            id_rol: true,
            password_hash: true
        }
    });
    
    users.forEach(u => {
        console.log(`ID: ${u.id_usuario} | User: ${u.username} | Rol: ${u.id_rol} | Hash: ${u.password_hash}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
