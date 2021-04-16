import { Test, TestingModule } from '@nestjs/testing';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

describe('SymbolsController', () => {
  let controller: SymbolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolsController],
      providers: [SymbolsService],
    }).compile();

    controller = module.get<SymbolsController>(SymbolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
