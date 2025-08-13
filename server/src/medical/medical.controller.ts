import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ClinicWithPatientsDto, PatientWithClinicDto, ClinicSummaryDto } from './dto/medical.dto';
import { MedicalService, ClinicWithPatients, PatientWithClinic } from './medical.service';

@ApiTags('medical')
@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Get('clinics-with-patients')
  @ApiOperation({ summary: 'Get all clinics with their patients' })
  @ApiResponse({
    status: 200,
    description: 'List of clinics with patient information',
    type: [ClinicWithPatientsDto],
  })
  async getClinicsWithPatients(): Promise<ClinicWithPatients[]> {
    return this.medicalService.getClinicsWithPatients();
  }

  @Get('patients-with-clinic')
  @ApiOperation({ summary: 'Get all patients with clinic information' })
  @ApiResponse({
    status: 200,
    description: 'List of patients with clinic names',
    type: [PatientWithClinicDto],
  })
  async getPatientsWithClinicInfo(): Promise<PatientWithClinic[]> {
    return this.medicalService.getPatientsWithClinicInfo();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get comprehensive clinic and patient summary' })
  @ApiResponse({
    status: 200,
    description: 'Complete summary of clinics and patients',
    type: ClinicSummaryDto,
  })
  async getClinicSummary(): Promise<{
    total_clinics: number;
    total_patients: number;
    clinics: ClinicWithPatients[];
  }> {
    return this.medicalService.getClinicSummary();
  }
}
