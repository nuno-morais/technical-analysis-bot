import { Test, TestingModule } from '@nestjs/testing';
import { DefaultApi } from 'finnhub';
import { AnalyserGateway } from './analyser.gateway';

const mockAggregateIndicator = jest.fn((symbol, resolution, cb) => {
  cb(null, {});
});
const mockDefaultApi = jest.fn().mockImplementation(() => {
  return { aggregateIndicator: mockAggregateIndicator };
});

describe('AnalyserGateway', () => {
  let service: AnalyserGateway;
  const provider = mockDefaultApi;

  beforeEach(async () => {
    mockAggregateIndicator.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyserGateway,
        {
          provide: DefaultApi,
          useClass: provider,
        },
      ],
    }).compile();

    service = module.get<AnalyserGateway>(AnalyserGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#aggregateIndicators', () => {
    it('should call the aggregate indicator', async () => {
      await service.aggregateIndicators('AAPL', 15);
      expect(mockAggregateIndicator).toHaveBeenCalledTimes(1);
      expect(mockAggregateIndicator.mock.calls[0][0]).toBe('AAPL');
      expect(mockAggregateIndicator.mock.calls[0][1]).toBe(15);
    });

    describe('when the service returns a result', () => {
      it('should return the object', async () => {
        mockAggregateIndicator.mockImplementation(
          (_symbol, _resolution, cb) => {
            cb(null, {});
          },
        );

        const result = await service.aggregateIndicators('AAPL', 15);
        expect(result).toStrictEqual({});
      });
    });

    describe('when the service throws an error', () => {
      it('should return the null object', async () => {
        mockAggregateIndicator.mockImplementation(
          (_symbol, _resolution, cb) => {
            cb('Error message', {});
          },
        );
        await service.aggregateIndicators('AAPL', 15);

        const result = await service.aggregateIndicators('AAPL', 15);
        expect(result).toBeNull();
      });
    });
  });
});
