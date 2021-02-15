import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@tab/core';
import * as Telegram from 'telegram-notify';

@Injectable()
export class TelegramGateway {
  public constructor(private readonly repository: NotificationRepository) {}

  public async send(accountId: string, text: string): Promise<void> {
    const provider = await this.repository.findOne({
      accountId,
      providerName: 'TELEGRAM',
    });

    const telegram = new Telegram({
      token: provider.provider.token,
      chatId: provider.provider.chat_id,
    });

    try {
      await telegram.send(text);
    } catch (e) {
      console.log('An error has occurred on sending a message to telegram.');
    }
  }
}
