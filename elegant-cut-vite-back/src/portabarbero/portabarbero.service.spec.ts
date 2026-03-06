import { Test, TestingModule } from '@nestjs/testing';
import { PortabarberoService } from './portabarbero.service';

describe('PortabarberoService', () => {
  let service: PortabarberoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortabarberoService],
    }).compile();

    service = module.get<PortabarberoService>(PortabarberoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
