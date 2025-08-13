import { Controller, Get, Param, ParseIntPipe, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { PatientDto } from './dto/patient.dto';
import { SortParamsDto } from './dto/sort-params.dto';
import { PatientsService, Patient } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all patients with optional sorting' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['id', 'clinic_id', 'first_name', 'last_name', 'date_of_birth'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'List of all patients',
    type: [PatientDto],
  })
  async findAll(@Query() sortParams?: SortParamsDto): Promise<Patient[]> {
    return this.patientsService.findAll(sortParams);
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Get patients by clinic ID with optional sorting' })
  @ApiParam({ name: 'clinicId', description: 'Clinic ID', type: 'number' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['id', 'clinic_id', 'first_name', 'last_name', 'date_of_birth'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'List of patients for the specified clinic',
    type: [PatientDto],
  })
  async findByClinicId(
    @Param('clinicId', ParseIntPipe) clinicId: number,
    @Query() sortParams?: SortParamsDto,
  ): Promise<Patient[]> {
    return this.patientsService.findByClinicId(clinicId, sortParams);
  }

  @Get('clinic-name')
  @ApiOperation({
    summary: 'Get patients by clinic name with optional sorting',
  })
  @ApiQuery({
    name: 'name',
    description: 'Clinic name',
    example: 'Salve Fertility',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['id', 'clinic_id', 'first_name', 'last_name', 'date_of_birth'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'List of patients for the specified clinic',
    type: [PatientDto],
  })
  async getPatientsByClinicName(
    @Query('name') clinicName: string,
    @Query() sortParams?: SortParamsDto,
  ): Promise<Patient[]> {
    return this.patientsService.getPatientsByClinicName(clinicName, sortParams);
  }

  @Get('count-by-clinic')
  @ApiOperation({ summary: 'Get patient count by clinic' })
  @ApiResponse({
    status: 200,
    description: 'Patient count for each clinic',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          clinic_id: { type: 'number', example: 1 },
          count: { type: 'number', example: 4 },
        },
      },
    },
  })
  async getPatientCountByClinic(): Promise<{ clinic_id: number; count: number }[]> {
    return this.patientsService.getPatientCountByClinic();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Patient found',
    type: PatientDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    const patient = await this.patientsService.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }
}
