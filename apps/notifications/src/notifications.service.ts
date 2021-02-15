import digger from '@lyngs/digger';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@tab/core';
import { SlackGateway } from './gateways/slack.gateway';
import { TelegramGateway } from './gateways/telegram.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly slackGateway: SlackGateway,
    private readonly telegramGateway: TelegramGateway,
  ) {}

  async sellSymbol(symbol: string, result: any) {
    const message = `🧨 SELL ${symbol}. '${JSON.stringify(result)}'`;
    const fields = this.convertToFields(result);
    await this.sendToAccounts(message, fields);
  }

  private convertToFields(result: any): any {
    return {
      Buy: digger(result, 'technicalAnalysis.count.buy'),
      Neutral: digger(result, 'technicalAnalysis.count.neutral'),
      Sell: digger(result, 'technicalAnalysis.count.sell'),
      Signal: digger(result, 'technicalAnalysis.signal'),
      Trend_Adx: digger(result, 'trend.adx'),
      Trend_Trending: digger(result, 'trend.trending') || 'false',
    };
  }

  private async sendToAccounts(text: string, fields: any): Promise<void> {
    const notifications = await this.repository.find();

    notifications.forEach(async (notification) => {
      switch (notification.providerName) {
        case 'SLACK':
          await this.slackGateway.send(notification.accountId, text, fields);
          break;
        case 'TELEGRAM':
          await this.telegramGateway.send(notification.accountId, text);
          break;
        default:
      }
    });
  }

  async buySymbol(symbol: string, result: any) {
    const message = `💰 BUY ${symbol}. '${JSON.stringify(result)}'`;
    const fields = this.convertToFields(result);
    await this.sendToAccounts(message, fields);
  }

  async ping() {
    console.log(`I'm alive. ${new Date().toUTCString()}`);
  }
}
