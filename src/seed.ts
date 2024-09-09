import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DbSeederService } from './commands/db-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbSeeder = app.get(DbSeederService);
  await dbSeeder.seed();
  await app.close();
}
bootstrap();
