import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClinicsModule } from './clinics';
import { MedicalModule } from './medical';
import { PatientsModule } from './patients';

@Module({
  imports: [ClinicsModule, PatientsModule, MedicalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
