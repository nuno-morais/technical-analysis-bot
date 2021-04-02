import { Test, TestingModule } from '@nestjs/testing';
import { DefaultApi } from 'finnhub';
import { SymbolsGateway } from './symbols.gateway';

const mockStockSymbols = jest.fn();
const mockDefaultApi = jest.fn().mockImplementation(() => {
  return { stockSymbols: mockStockSymbols };
});

describe('SymbolsGateway', () => {
  let gateway: SymbolsGateway;

  beforeEach(async () => {
    mockStockSymbols.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymbolsGateway,
        {
          provide: DefaultApi,
          useClass: mockDefaultApi,
        },
      ],
    }).compile();

    gateway = module.get<SymbolsGateway>(SymbolsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('#isAvailable', () => {
    describe('when there is no cache for the market', () => {
      it('should requests the api', async () => {
        mockStockSymbols.mockImplementation((market, cb) => {
          cb(null, [{ symbol: 'AAPL' }, { symbol: 'MSFT' }]);
        });
        await gateway.isAvailable('US', 'AAPL');

        expect(mockStockSymbols).toBeCalledTimes(1);
        expect(mockStockSymbols.mock.calls[0][0]).toBe('US');
      });

      it('should return true', async () => {
        const result = await gateway.isAvailable('US', 'AAPL');

        expect(result).toBe(true);
      });
    });

    describe('when there is cache for the market', () => {
      it('should not call the gateway', async () => {
        mockStockSymbols.mockImplementation((market, cb) => {
          cb(null, [{ symbol: 'AAPL' }, { symbol: 'MSFT' }]);
        });
        await gateway.isAvailable('US', 'AAPL');
        mockStockSymbols.mockClear();
        await gateway.isAvailable('US', 'AAPL');

        expect(mockStockSymbols).toBeCalledTimes(0);
      });
      it('should return the value of the cache', async () => {
        const result = await gateway.isAvailable('US', 'XI');

        expect(result).toBe(false);
      });
    });
  });
});
