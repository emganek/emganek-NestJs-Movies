import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      origin: [
        'http://hn-workspace.io.vn',
        'http://www.hn-workspace.io.vn',
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }
  );
  app.useGlobalFilters();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
