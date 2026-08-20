import { Test, TestingModule } from '@nestjs/testing';
import { PortabarberoService } from '../../src/modules/portabarbero/portabarbero.service';
import { PortabarberoRepository } from '../../src/modules/portabarbero/portabarbero.repository';

describe('PortabarberoService', () => {
  let service: PortabarberoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortabarberoService,
        {
          provide: PortabarberoRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
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
