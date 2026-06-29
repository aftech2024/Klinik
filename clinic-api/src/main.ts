import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow all local frontend ports (web:3000, admin:3002, portal:3003)
  const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:3000,http://localhost:3002,http://localhost:3003').split(',');
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('aftech Klinik API')
    .setDescription('Clinic Management System API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Branches', 'Branch Management')
    .addTag('Doctors', 'Doctor Management')
    .addTag('Services', 'Clinic Services')
    .addTag('Appointments', 'Appointment & Booking')
    .addTag('Content', 'Promotions, Articles, FAQs, Testimonials')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🏥 aftech Klinik API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
