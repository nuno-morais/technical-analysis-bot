import digger from '@lyngs/digger';
import { Inject, Injectable } from '@nestjs/common';
import * as Telegram from 'telegram-notify';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly telegram: Telegram,
    @Inject('SLACK') private readonly slack,
  ) {}

  async sellSymbol(symbol: string, result: any) {
    const message = `🧨 SELL ${symbol}. '${JSON.stringify(result)}'`;
    this.sendToTelegram(message);
    this.sendToSlack(message, result);
  }

  private async sendToTelegram(message) {
    try {
      await this.telegram.send(message);
    } catch (e) {
      console.log('An error has occurred on sending a message to telegram.');
    }
  }

  private async sendToSlack(message, result) {
    try {
      await this.slack.alert({
        text: message,
        fields: {
          Buy: digger(result, 'technicalAnalysis.count.buy'),
          Neutral: digger(result, 'technicalAnalysis.count.neutral'),
          Sell: digger(result, 'technicalAnalysis.count.sell'),
          Signal: digger(result, 'technicalAnalysis.signal'),
          Trend_Adx: digger(result, 'trend.adx'),
          Trend_Trending: digger(result, 'trend.trending') || 'false',
        },
      });
    } catch (e) {
      console.log(e);
      console.log('An error has occurred on sending a message to slack.');
    }
  }

  async buySymbol(symbol: string, result: any) {
    const message = `💰 BUY ${symbol}. '${JSON.stringify(result)}'`;
    this.sendToTelegram(message);
    this.sendToSlack(message, result);
  }
}
