#!/usr/bin/env node

const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { AppModule } = require('../dist/app.module');

async function generateOpenAPI() {
  try {
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

    // Generate OpenAPI JSON file
    const outputPath = join(__dirname, '../../openapi.json');
    writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`✅ OpenAPI specification saved to: ${outputPath}`);

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI specification:', error);
    process.exit(1);
  }
}

generateOpenAPI();
