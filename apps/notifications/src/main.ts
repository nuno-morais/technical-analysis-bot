import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(NotificationsModule);
}
bootstrap();
