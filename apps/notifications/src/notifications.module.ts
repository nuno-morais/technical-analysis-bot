import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import 'dotenv/config';
import * as slack from 'slack-notify';
import * as Telegram from 'telegram-notify';
import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const telegramProvider = {
  provide: Telegram,
  useFactory: () => {
    return new Telegram({
      token: process.env.TELEGRAM_TOKEN,
      chatId: process.env.TELEGRAM_CHATID,
    });
  },
};

const slackProvider = {
  provide: 'SLACK',
  useValue: slack(process.env.SLACK_WEBHOOK_URL),
};

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.ANALYSER_RMQ_URL.split(','),
      exchanges: [
        {
          name: 'analyser',
          type: 'topic',
        },
        {
          name: 'healthcheck',
          type: 'topic',
        },
      ],
    }),
    NotificationsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    telegramProvider,
    NotificationsConsumer,
    slackProvider,
  ],
})
export class NotificationsModule {}
