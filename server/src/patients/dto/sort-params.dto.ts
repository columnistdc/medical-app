import { ApiProperty } from '@nestjs/swagger';

export class SortParamsDto {
  @ApiProperty({
    description: 'Field to sort by',
    example: 'first_name',
    required: false,
    enum: ['id', 'clinic_id', 'first_name', 'last_name', 'date_of_birth'],
  })
  sortBy?: 'id' | 'clinic_id' | 'first_name' | 'last_name' | 'date_of_birth';

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    example: 'asc',
    required: false,
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  sortOrder?: 'asc' | 'desc';
}
