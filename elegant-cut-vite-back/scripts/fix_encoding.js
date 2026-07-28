const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixEncoding() {
    const fixes = [
        { id: 11, descripcion: "Degradado bajo, medio o alto con transición limpia" },
        { id: 13, descripcion: "Laterales cortos con desconexión superior" },
        { id: 16, descripcion: "Corto adelante y largo atrás con estilo moderno" },
        { id: 21, descripcion: "Volumen superior peinado hacia atrás" },
        { id: 22, descripcion: "Corte clásico con raya al lado" },
        { id: 23, nombre: "Barba 3 días", descripcion: "Barba corta tipo sombra" },
        { id: 38, descripcion: "Tratamiento de alisado y reparación capilar" },
        { id: 39, descripcion: "Coloración en cabello corto" },
        { id: 40, descripcion: "Coloración en cabello largo" },
    ];

    for (const fix of fixes) {
        const data = {};
        if (fix.nombre) data.nombre = fix.nombre;
        if (fix.descripcion) data.descripcion = fix.descripcion;

        await prisma.servicios.update({
            where: { id_servicio: fix.id },
            data,
        });
        console.log(`Fixed service ${fix.id}: ${fix.nombre || ''} ${fix.descripcion || ''}`);
    }

    // Also fix reservas observaciones
    const reservas = await prisma.reservas.findMany();
    for (const r of reservas) {
        if (r.observaciones && r.observaciones.includes("?")) {
            const fixed = r.observaciones
                .replace(/dise\?o/g, "diseño")
                .replace(/l\?nea/g, "línea")
                .replace(/gustaria/g, "gustaría")
                .replace(/gistaria/g, "gustaría")
                .replace(/decoloraod/g, "decolorado");
            
            await prisma.reservas.update({
                where: { id_reservas: r.id_reservas },
                data: { observaciones: fixed },
            });
            console.log(`Fixed reserva ${r.id_reservas}: ${fixed}`);
        }
    }

    console.log("Done!");
}

fixEncoding()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
