import { Test, TestingModule } from '@nestjs/testing';
import { TradesSummaryController } from './trades-summary.controller';
import { TradesSummaryInteractor } from './trades-summary.interactor';

describe('TradesSummaryController', () => {
  let controller: TradesSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesSummaryController],
      providers: [TradesSummaryInteractor],
    }).compile();

    controller = module.get<TradesSummaryController>(TradesSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
