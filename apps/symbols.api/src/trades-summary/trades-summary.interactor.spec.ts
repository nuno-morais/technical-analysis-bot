import { Test, TestingModule } from '@nestjs/testing';
import { TradesSummaryInteractor } from './trades-summary.interactor';

describe('TradesSummaryInteractor', () => {
  let service: TradesSummaryInteractor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradesSummaryInteractor],
    }).compile();

    service = module.get<TradesSummaryInteractor>(TradesSummaryInteractor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
