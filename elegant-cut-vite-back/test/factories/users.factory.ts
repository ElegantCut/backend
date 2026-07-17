import { faker } from '@faker-js/faker';
import { usuarios } from '@prisma/client';

export function makeUser(
    overrides: Partial<usuarios> = {},
): usuarios {
   return {
    id_usuario: faker.number.int({min:1, max:1000}),
    prim_nombre: faker.person.firstName(),
    apellido1: faker.person.lastName(),
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
    id_rol: faker.number.int({min:1, max: 3}),

    ...overrides,
   };
}
