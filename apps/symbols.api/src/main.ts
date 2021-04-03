import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { SymbolsApiModule } from './symbols.api.module';

async function bootstrap() {
  const app = await NestFactory.create(SymbolsApiModule);
  app.enableCors({
    exposedHeaders: ['X-Total-Count'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Technical Analysis Bot')
    .setDescription('')
    .setVersion('1.0')
    .addTag('portfolios')
    .addTag('trades')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
