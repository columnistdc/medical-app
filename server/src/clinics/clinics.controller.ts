import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClinicsService, Clinic } from './clinics.service';
import { ClinicDto } from './dto/clinic.dto';

@ApiTags('clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all clinics',
    type: [ClinicDto]
  })
  async findAll(): Promise<Clinic[]> {
    return this.clinicsService.findAll();
  }

  @Get('names')
  @ApiOperation({ summary: 'Get clinic names only' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of clinic names',
    type: [String]
  })
  async getNames(): Promise<string[]> {
    return this.clinicsService.getNames();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiParam({ name: 'id', description: 'Clinic ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Clinic found',
    type: ClinicDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Clinic not found'
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    const clinic = await this.clinicsService.findById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
    return clinic;
  }
}
