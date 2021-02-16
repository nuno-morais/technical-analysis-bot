import { Test, TestingModule } from '@nestjs/testing';
import { AnalyserConsumer } from './analyser.consumer';
import { AnalyserInteractor } from './analyser.interactor';

const mockCall = jest.fn();
const mockAnalyserInteractor = jest.fn().mockImplementation(() => {
  return { call: mockCall };
});

describe('AnalyserConsumer', () => {
  let service: AnalyserConsumer;
  const interactor = mockAnalyserInteractor;

  beforeEach(async () => {
    mockCall.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyserConsumer,
        {
          provide: AnalyserInteractor,
          useClass: interactor,
        },
      ],
    }).compile();

    service = module.get<AnalyserConsumer>(AnalyserConsumer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#competingPubSubHandler', () => {
    it('should call the interactor', async () => {
      await service.competingPubSubHandler({
        object: { symbol: 'AAPL', resolution: 15 },
      });

      expect(mockCall).toHaveBeenCalledTimes(1);
      expect(mockCall.mock.calls[0][0]).toBe('AAPL');
      expect(mockCall.mock.calls[0][1]).toBe(15);
    });
  });
});
