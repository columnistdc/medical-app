import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Medical App API')
    .setDescription('API for managing medical clinics and patients')
    .setVersion('1.0')
    .addTag('clinics', 'Clinic management endpoints')
    .addTag('patients', 'Patient management endpoints')
    .addTag('medical', 'Combined medical data endpoints')
    .addServer('http://localhost:4000', 'Local development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Generate OpenAPI JSON file for frontend
  if (process.env.NODE_ENV === 'development') {
    const outputPath = join(__dirname, '../../openapi.json');
    writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI specification saved to: ${outputPath}`);
  }

  // Customize Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
    },
    customSiteTitle: 'Medical App API Documentation',
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Failed to start application:', error);
  process.exit(1);
});
