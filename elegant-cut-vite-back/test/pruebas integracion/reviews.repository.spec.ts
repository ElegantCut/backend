import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from '../../src/modules/reviews/reviews.repository';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ReviewsRepository - Pruebas Unitarias', () => {
    let repo: ReviewsRepository;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            resenas: {
                findMany: jest.fn().mockResolvedValue([
                    { id_resena: 1, calificacion: 5, estado: 1 }
                ]),
                update: jest.fn().mockResolvedValue({ id_resena: 1, estado: 0 }),
                delete: jest.fn().mockResolvedValue({ id_resena: 1 }),
            }
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsRepository,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        repo = module.get<ReviewsRepository>(ReviewsRepository);
    });

    describe('Búsqueda de Reseñas', () => {
        it('should find all by barbero and correctly use Number.isNaN', async () => {
            const result = await repo.findBarberReviews(1);
            expect(result).toBeDefined();
            expect(prismaMock.resenas.findMany).toHaveBeenCalled();
            
            const resultString = await repo.findBarberReviews("1" as any);
            expect(resultString).toBeDefined();

            const resultNull = await repo.findBarberReviews(null as any);
            expect(resultNull).toBeDefined();
        });
    });

    describe('RF-010: Moderación de Reseñas', () => {
        it('Debe cambiar el estado de visibilidad de una reseña (ocultar = 0 / aprobar = 1)', async () => {
            const result = await repo.changeStatusAdmin(1, 0);

            expect(result.estado).toBe(0);
            expect(prismaMock.resenas.update).toHaveBeenCalledWith({
                where: { id_resena: 1 },
                data: { estado: 0 }
            });
        });

        it('Debe eliminar definitivamente una reseña inapropiada', async () => {
            const result = await repo.deleteAdmin(1);

            expect(prismaMock.resenas.delete).toHaveBeenCalledWith({
                where: { id_resena: 1 }
            });
        });
    });
});

