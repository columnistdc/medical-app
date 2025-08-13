import { Module } from '@nestjs/common';

import { ClinicsModule } from '../clinics';
import { PatientsModule } from '../patients';

import { MedicalController } from './medical.controller';
import { MedicalService } from './medical.service';

@Module({
  imports: [ClinicsModule, PatientsModule],
  controllers: [MedicalController],
  providers: [MedicalService],
  exports: [MedicalService],
})
export class MedicalModule {}
