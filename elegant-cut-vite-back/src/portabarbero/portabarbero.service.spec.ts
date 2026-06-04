import { Test, TestingModule } from '@nestjs/testing';
import { PortabarberoService } from './portabarbero.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PortabarberoService', () => {
  let service: PortabarberoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortabarberoService,
        {
          // Mock de PrismaService: evita conectar a BD real en pruebas unitarias
          provide: PrismaService,
          useValue: {
            portafolios: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PortabarberoService>(PortabarberoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
