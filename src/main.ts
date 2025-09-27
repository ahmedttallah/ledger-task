import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ledger / Wallet Service')
    .setDescription('API documentation for Ledger/Wallet transactions')
    .setVersion('1.0')
    .addTag('wallet')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);
  console.log(`📚 Swagger available at http://localhost:${port}/api/docs`);
}

void bootstrap();
