import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
