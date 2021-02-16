/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyserGateway } from './analyser.gateway';
import { AnalyserInteractor } from './analyser.interactor';

const mockAggregateIndicators = jest.fn();
const mockAnalyserGateway = jest.fn().mockImplementation(() => {
  return { aggregateIndicators: mockAggregateIndicators };
});

const mockPublish = jest.fn();
const mockAmqpConnection = jest.fn().mockImplementation(() => {
  return { publish: mockPublish };
});

describe('AnalyserInteractor', () => {
  let interactor: AnalyserInteractor;

  beforeEach(async () => {
    mockAggregateIndicators.mockClear();
    mockPublish.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyserInteractor,
        {
          provide: AnalyserGateway,
          useClass: mockAnalyserGateway,
        },
        {
          provide: 'ANALYSER_RMQ',
          useClass: mockAmqpConnection,
        },
      ],
    }).compile();

    interactor = module.get<AnalyserInteractor>(AnalyserInteractor);
  });

  it('should be defined', () => {
    expect(interactor).toBeDefined();
  });

  describe('#call', () => {
    describe('when the symbol is HEALTH_CHECKER', () => {
      it('should not call the gateway', async () => {
        await interactor.call('HEALTH_CHECKER', 15);

        expect(mockAggregateIndicators).toHaveBeenCalledTimes(0);
      });

      it('should publish a SYSTEM_CHECKER_HEALTH', async () => {
        await interactor.call('HEALTH_CHECKER', 15);

        expect(mockPublish).toHaveBeenCalledTimes(1);
        expect(mockPublish.mock.calls[0][0]).toBe('');
        expect(mockPublish.mock.calls[0][1]).toBe('healthcheck_queue');
        expect(mockPublish.mock.calls[0][2]).toStrictEqual({
          event: 'SYSTEM_CHECKER_HEALTH',
          object: {
            type: 'HEALTH',
            resolution: 15,
          },
          verb: 'sell',
          actor: {
            name: 'system',
          },
        });
      });
    });

    describe('when the symbol is defined', () => {
      it('should call the gateway', async () => {
        await interactor.call('AAPL', 15);

        expect(mockAggregateIndicators).toHaveBeenCalledTimes(1);
        expect(mockAggregateIndicators.mock.calls[0][0]).toBe('AAPL');
        expect(mockAggregateIndicators.mock.calls[0][1]).toBe(15);
      });

      describe('when the service answers with null', () => {
        beforeEach(async () => {
          mockAggregateIndicators.mockImplementation(
            async (_symbol, _resolution) => null,
          );
        });

        it('should do not publish any event', async () => {
          await interactor.call('AAPL', 15);

          expect(mockPublish).toHaveBeenCalledTimes(0);
        });

        it('should do not throw any exception', async () => {
          await interactor.call('AAPL', 15);
          expect(await interactor.call('AAPL', 15)).toBe(undefined);
        });
      });

      describe('when the service answers with an object', () => {
        describe('when the signal is buy', () => {
          const result = {
            technicalAnalysis: {
              signal: 'buy',
            },
          };
          beforeEach(async () => {
            mockAggregateIndicators.mockImplementation(
              async (_symbol, _resolution) => result,
            );
          });

          it('should publish the SYSTEM_BUY_SYMBOL', async () => {
            await interactor.call('AAPL', 15);

            expect(mockPublish).toHaveBeenCalledTimes(1);
            expect(mockPublish.mock.calls[0][0]).toBe('analyser');
            expect(mockPublish.mock.calls[0][1]).toBe('buy_order_analyse');
            expect(mockPublish.mock.calls[0][2]).toStrictEqual({
              event: 'SYSTEM_BUY_SYMBOL',
              object: {
                symbol: 'AAPL',
                result,
              },
              verb: 'buy',
              actor: {
                name: 'system',
              },
            });
          });
        });

        describe('when the signal is sell', () => {
          const result = {
            technicalAnalysis: {
              signal: 'sell',
            },
          };
          beforeEach(async () => {
            mockAggregateIndicators.mockImplementation(
              async (_symbol, _resolution) => result,
            );
          });
          it('should publish the SYSTEM_SELL_SYMBOL', async () => {
            await interactor.call('AAPL', 15);

            expect(mockPublish).toHaveBeenCalledTimes(1);
            expect(mockPublish.mock.calls[0][0]).toBe('analyser');
            expect(mockPublish.mock.calls[0][1]).toBe('sell_order_analyse');
            expect(mockPublish.mock.calls[0][2]).toStrictEqual({
              event: 'SYSTEM_SELL_SYMBOL',
              object: {
                symbol: 'AAPL',
                result,
              },
              verb: 'sell',
              actor: {
                name: 'system',
              },
            });
          });
        });

        describe('when the signal is neutral', () => {
          const result = {
            technicalAnalysis: {
              signal: 'neutral',
            },
          };
          beforeEach(async () => {
            mockAggregateIndicators.mockImplementation(
              async (_symbol, _resolution) => result,
            );
          });
          it('should not publish', async () => {
            await interactor.call('AAPL', 15);

            expect(mockPublish).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
  });
});
