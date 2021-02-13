import { Test, TestingModule } from '@nestjs/testing';
import { SymbolsApiController } from './symbols.api.controller';
import { SymbolsApiService } from './symbols.api.service';

describe('SymbolsApiController', () => {
  let symbolsApiController: SymbolsApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SymbolsApiController],
      providers: [SymbolsApiService],
    }).compile();

    symbolsApiController = app.get<SymbolsApiController>(SymbolsApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(symbolsApiController.getHello()).toBe('Hello World!');
    });
  });
});
