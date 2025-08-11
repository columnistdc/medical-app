import { ApiProperty } from '@nestjs/swagger';

export class ClinicDto {
  @ApiProperty({ 
    description: 'Unique identifier for the clinic',
    example: 1
  })
  id: number;

  @ApiProperty({ 
    description: 'Name of the clinic',
    example: 'Salve Fertility'
  })
  name: string;
}
