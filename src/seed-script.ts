import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeedService);
  await seeder.seed();
  await app.close();
}

bootstrap();
