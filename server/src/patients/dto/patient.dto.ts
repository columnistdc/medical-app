import { ApiProperty } from '@nestjs/swagger';

export class PatientDto {
  @ApiProperty({
    description: 'Unique identifier for the patient',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the clinic the patient belongs to',
    example: 1,
  })
  clinic_id: number;

  @ApiProperty({
    description: 'Patient first name',
    example: 'Harriott',
  })
  first_name: string;

  @ApiProperty({
    description: 'Patient last name',
    example: 'Wansbury',
  })
  last_name: string;

  @ApiProperty({
    description: 'Patient date of birth',
    example: '1961-10-16',
  })
  date_of_birth: string;
}
