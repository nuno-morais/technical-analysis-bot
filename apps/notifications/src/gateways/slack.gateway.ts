import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@tab/core';
import * as slack from 'slack-notify';

@Injectable()
export class SlackGateway {
  public constructor(private readonly repository: NotificationRepository) {}

  public async send(
    accountId: string,
    text: string,
    fields: any,
  ): Promise<void> {
    const provider = await this.repository.findOne({
      accountId,
      providerName: 'SLACK',
    });

    try {
      slack(provider.provider.webhook_url).alert({ text, fields });
    } catch (e) {
      console.log('An error has occurred on sending a message to slack.');
    }
  }
}
