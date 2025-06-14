import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './core/interceptor/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Kuizzz API')
    .setDescription('API documentation for Kuizzz backend (JWT Auth, roles, RBAC, etc)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`API server running on: http://localhost:3000/`);
  console.log(`Swagger docs available at: http://localhost:3000/api`);
}
bootstrap();
