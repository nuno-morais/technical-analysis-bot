import { Test, TestingModule } from '@nestjs/testing';
import { DefaultApi } from 'finnhub';
import { FinnhubGateway } from './finnhub.gateway';

const mockStockSymbols = jest.fn();
const mockDefaultApi = jest.fn().mockImplementation(() => {
  return { stockSymbols: mockStockSymbols };
});

describe('FinnhubGateway', () => {
  let gateway: FinnhubGateway;

  beforeEach(async () => {
    mockStockSymbols.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinnhubGateway,
        {
          provide: DefaultApi,
          useClass: mockDefaultApi,
        },
      ],
    }).compile();

    gateway = module.get<FinnhubGateway>(FinnhubGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('#availableSymbol', () => {
    describe('when there is no cache for the market', () => {
      it('should requests the api', async () => {
        mockStockSymbols.mockImplementation((market, cb) => {
          cb(null, [{ symbol: 'AAPL' }, { symbol: 'MSFT' }]);
        });
        await gateway.availableSymbol('US', 'AAPL');

        expect(mockStockSymbols).toBeCalledTimes(1);
        expect(mockStockSymbols.mock.calls[0][0]).toBe('US');
      });

      it('should return true', async () => {
        const result = await gateway.availableSymbol('US', 'AAPL');

        expect(result).toBe(true);
      });
    });

    describe('when there is cache for the market', () => {
      it('should not call the gateway', async () => {
        mockStockSymbols.mockImplementation((market, cb) => {
          cb(null, [{ symbol: 'AAPL' }, { symbol: 'MSFT' }]);
        });
        await gateway.availableSymbol('US', 'AAPL');
        mockStockSymbols.mockClear();
        await gateway.availableSymbol('US', 'AAPL');

        expect(mockStockSymbols).toBeCalledTimes(0);
      });
      it('should return the value of the cache', async () => {
        const result = await gateway.availableSymbol('US', 'XI');

        expect(result).toBe(false);
      });
    });
  });
});
