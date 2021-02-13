import { NestFactory } from '@nestjs/core';
import { NotificationsApiModule } from './notifications.api.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsApiModule);
  await app.listen(3000);
}
bootstrap();
