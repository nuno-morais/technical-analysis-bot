import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import 'dotenv/config';
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

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.ANALYSER_RMQ_URL.split(','),
      exchanges: [
        {
          name: 'analyser',
          type: 'topic',
        },
      ],
    }),
    NotificationsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, telegramProvider, NotificationsConsumer],
})
export class NotificationsModule {}
