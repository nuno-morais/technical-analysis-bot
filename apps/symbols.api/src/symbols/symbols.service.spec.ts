import { Test, TestingModule } from '@nestjs/testing';
import { SymbolsService } from './symbols.service';

describe('SymbolsService', () => {
  let service: SymbolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymbolsService],
    }).compile();

    service = module.get<SymbolsService>(SymbolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
