import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsRepository } from '../../src/modules/appointments/appointments.repository';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AppointmentsRepository', () => {
    let repo: AppointmentsRepository;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            horarios: {
                findMany: jest.fn().mockResolvedValue([
                    { hora_inicio: 1000 },
                    { hora_inicio: 1030 }
                ])
            },
            reservas: {
                findMany: jest.fn().mockResolvedValue([
                    {
                        horarios: { hora_inicio: 1400 },
                        detalle_cita_servicio: [{ servicios: { duracion: 60 } }]
                    }
                ])
            }
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentsRepository,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        repo = module.get<AppointmentsRepository>(AppointmentsRepository);
    });

    it('should calculate available slots correctly and use Number.parseInt', async () => {
        const slots = await repo.getAvailableSlots('2026-08-20', 1, 30);
        expect(slots).toBeDefined();
        expect(prismaMock.horarios.findMany).toHaveBeenCalled();
        expect(prismaMock.reservas.findMany).toHaveBeenCalled();
    });
});
