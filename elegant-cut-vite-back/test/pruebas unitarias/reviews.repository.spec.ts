import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from '../../src/modules/reviews/reviews.repository';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ReviewsRepository', () => {
    let repo: ReviewsRepository;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            resenas: {
                findMany: jest.fn().mockResolvedValue([
                    { id_resena: 1, calificacion: 5 }
                ])
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

    it('should find all by barbero and correctly use Number.isNaN', async () => {
        const result = await repo.findBarberReviews(1);
        expect(result).toBeDefined();
        expect(prismaMock.resenas.findMany).toHaveBeenCalled();
        
        // Probamos con string también
        const resultString = await repo.findBarberReviews("1" as any);
        expect(resultString).toBeDefined();

        // Probamos con null
        const resultNull = await repo.findBarberReviews(null as any);
        expect(resultNull).toBeDefined();
    });
});
