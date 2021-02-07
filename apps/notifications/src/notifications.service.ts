import { Injectable } from '@nestjs/common';
import * as Telegram from 'telegram-notify';

@Injectable()
export class NotificationsService {
  constructor(private readonly telegram: Telegram) {}

  async sellSymbol(symbol: string, result: any) {
    const message = `🧨 SELL ${symbol}. '${JSON.stringify(result)}'`;
    await this.telegram.send(message);
  }

  async buySymbol(symbol: string, result: any) {
    const message = `💰 BUY ${symbol}. '${JSON.stringify(result)}'`;
    await this.telegram.send(message);
  }
}
